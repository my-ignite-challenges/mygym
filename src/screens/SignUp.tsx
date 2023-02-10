import {
  VStack,
  Center,
  Heading,
  ScrollView,
  Alert,
  useToast,
} from "native-base";

import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { Input } from "@components/Input";
import { Brand } from "@components/Brand";
import { Button } from "@components/Button";

import { api } from "@services/api";
import { AppError } from "@utils/AppError";

type SignUpData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

const signUpSchema = yup.object({
  name: yup.string().required("Informe o nome"),
  email: yup.string().required("Informe o email").email("Email inválido"),
  password: yup
    .string()
    .required("Informe a senha")
    .min(6, "Deve conter no mínimo 6 caracteres"),
  password_confirmation: yup
    .string()
    .required("Confirme a senha")
    .oneOf([yup.ref("password"), null], "As senhas não conferem"),
});

export function SignUp() {
  const { goBack } = useNavigation();

  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpData>({
    resolver: yupResolver(signUpSchema),
  });

  async function handleSignUp({ name, email, password }: SignUpData) {
    try {
      await api.post("/users", { name, email, password });
    } catch (error) {
      const isAppError = error instanceof AppError;

      const toastTitle = isAppError
        ? error.message
        : "Não foi possível criar a conta. Tente novamente mais tarde";

      toast.show({
        title: toastTitle,
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10} pb={16}>
        <Brand />

        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Crie sua conta
          </Heading>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password_confirmation"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirmar Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
                errorMessage={errors.password_confirmation?.message}
              />
            )}
          />

          <Button
            title="Criar e acessar"
            onPress={handleSubmit(handleSignUp)}
          />
        </Center>

        <Button
          title="Voltar para o login"
          variant="outline"
          mt={12}
          onPress={goBack}
        />
      </VStack>
    </ScrollView>
  );
}
