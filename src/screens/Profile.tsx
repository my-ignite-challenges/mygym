import { useState } from "react";

import { TouchableOpacity } from "react-native";

import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import {
  Center,
  Heading,
  ScrollView,
  Skeleton,
  Text,
  useToast,
  VStack,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { Avatar } from "@components/Avatar";
import { Button } from "@components/Button";
import { Header } from "@components/Header";
import { Input } from "@components/Input";
import { useAuth } from "@hooks/useAuth";

import defaultAvatar from "@assets/avatar-default.png";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";

const AVATAR_SIZE = 33;

type FormData = {
  name: string;
  email: string;
  password: string;
  old_password: string;
  confirm_password: string;
};

const profileSchema = yup.object({
  name: yup.string().required("Informe o nome"),
  password: yup
    .string()
    .min(6, "A senha deve conter pelo menos 6 dígitos")
    .nullable()
    .transform((value) => (!!value ? value : null)),
  confirm_password: yup.string().when("password", {
    is: (Field: any) => Field,
    then: yup
      .string()
      .oneOf(
        [yup.ref("password"), null],
        "A nova senha e sua confirmação não conferem."
      )
      .nullable()
      .required("Informe a confirmação da senha.")
      .transform((value) => (!!value ? value : null)),
  }),
});

export function Profile() {
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [isProfileUpdateInProgress, setIsProfileUpdateInProgress] =
    useState(false);

  const toast = useToast();
  const { user, updateUserProfile } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  });

  async function handleUserAvatarSelection() {
    try {
      setIsAvatarLoading(true);
      const selectedPhoto = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (selectedPhoto.cancelled) {
        return;
      }

      if (selectedPhoto.uri) {
        const photoInfo = await FileSystem.getInfoAsync(selectedPhoto.uri);

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title:
              "O tamanho da imagem selecionada excede o limite de 5MB. Selecione uma imagem menor.",
            placement: "top",
            bgColor: "red.500",
          });
        }

        const fileExtension = selectedPhoto.uri.split(".").pop();

        const selectedPhotoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: selectedPhoto.uri,
          type: `${selectedPhoto.type}/${fileExtension}`,
        } as any;

        const avatarUploadForm = new FormData();
        avatarUploadForm.append("avatar", selectedPhotoFile);

        const avatarUploadResponse = await api.patch(
          "/users/avatar",
          avatarUploadForm,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const userToUpdate = user;
        userToUpdate.avatar = avatarUploadResponse.data.avatar;

        await updateUserProfile(userToUpdate);

        toast.show({
          title: "Foto de perfil atualizada com sucesso.",
          placement: "top",
          bgColor: "green.500",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsAvatarLoading(false);
    }
  }

  async function handleProfileUpdate(data: FormData) {
    try {
      setIsProfileUpdateInProgress(true);

      const userToUpdate = user;

      userToUpdate.name = data.name;

      await api.put("/users", data);

      await updateUserProfile(userToUpdate);

      toast.show({
        title: "Perfil atualizado com sucesso",
        placement: "top",
        bgColor: "green.500",
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const toastTitle = isAppError
        ? error.message
        : "Não foi possível atualizarr os dados. Tente novamente mais tarde";

      toast.show({
        title: toastTitle,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsProfileUpdateInProgress(false);
    }
  }

  return (
    <VStack flex={1}>
      <Header title="Perfil" />
      <ScrollView>
        <Center mt={6} px={10}>
          {isAvatarLoading ? (
            <Skeleton
              w={AVATAR_SIZE}
              h={AVATAR_SIZE}
              rounded="full"
              startColor="gray.500"
              endColor="gray.400"
            />
          ) : (
            <Avatar
              source={
                user.avatar
                  ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                  : defaultAvatar
              }
              alt="Imagem do usuário"
              size={AVATAR_SIZE}
            />
          )}

          <TouchableOpacity onPress={handleUserAvatarSelection}>
            <Text
              color="green.500"
              fontWeight="bold"
              fontSize="md"
              mt={2}
              mb={8}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="Nome"
                bg="gray.600"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="Email"
                isDisabled
                bg="gray.600"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </Center>

        <VStack px={10} mt={12} mb={9}>
          <Heading color="gray.200" fontSize="md" mb={2}>
            Alterar senha
          </Heading>

          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Senha atual"
                bg="gray.600"
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Nova senha"
                bg="gray.600"
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Confirme a nova senha"
                bg="gray.600"
                onChangeText={onChange}
                errorMessage={errors.confirm_password?.message}
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isProfileUpdateInProgress}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
