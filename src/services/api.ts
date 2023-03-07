import axios, { AxiosError, AxiosInstance } from "axios";

import { getTokenFromStorage, saveTokenToStorage } from "@storage/token";
import { AppError } from "@utils/AppError";
import { host } from "../secrets/host";

type SignOut = () => void;

type PromiseProps = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
};

type APIInstanceProps = AxiosInstance & {
  interceptTokenManagement: (signOut: SignOut) => () => void;
};

const api = axios.create({
  baseURL: `http://${host}:3333`,
}) as APIInstanceProps;

let failedRequestQueue: PromiseProps[] = [];
let isTokenRefreshing = false;

api.interceptTokenManagement = (signOut) => {
  const tokenManagementInterceptor = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      if (requestError?.response?.status === 401) {
        if (
          requestError.response.data?.message === "token.expired" ||
          requestError.response.data?.message === "token.invalid"
        ) {
          const { refresh_token } = await getTokenFromStorage();

          if (!refresh_token) {
            signOut();
            return Promise.reject(requestError);
          }

          const originalRequestDetails = requestError.config;

          if (isTokenRefreshing) {
            return new Promise((resolve, reject) => {
              failedRequestQueue.push({
                onSuccess: (token: string) => {
                  originalRequestDetails.headers = {
                    Authorization: `Bearer ${token}`,
                  };
                  resolve(api(originalRequestDetails));
                },
                onFailure: (error: AxiosError) => {
                  reject(error);
                },
              });
            });
          }

          isTokenRefreshing = true;

          return new Promise(async (resolve, reject) => {
            try {
              const { data } = await api.post("/sessions/refresh-token", {
                refresh_token,
              });

              await saveTokenToStorage({
                token: data.token,
                refresh_token: data.refresh_token,
              });

              if (originalRequestDetails.data) {
                originalRequestDetails.data = JSON.parse(
                  originalRequestDetails.data
                );
              }

              originalRequestDetails.headers = {
                Authorization: `Bearer ${data.token}`,
              };

              api.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${data.token}`;

              failedRequestQueue.forEach((request) => {
                request.onSuccess(data.token);
              });

              resolve(api(originalRequestDetails));
            } catch (error: any) {
              failedRequestQueue.forEach((request) => {
                request.onFailure(error);
              });

              signOut();
              reject(error);
            } finally {
              isTokenRefreshing = false;
              failedRequestQueue = [];
            }
          });
        }

        signOut();
      }

      if (requestError.response && requestError.response.data) {
        return Promise.reject(new AppError(requestError.response.data.message));
      } else {
        return Promise.reject(requestError);
      }
    }
  );

  return () => {
    api.interceptors.response.eject(tokenManagementInterceptor);
  };
};

export { api };
