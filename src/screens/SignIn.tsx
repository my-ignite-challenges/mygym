import { VStack, Text, Center, Heading, ScrollView } from "native-base";
import { useNavigation } from "@react-navigation/native";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { Brand } from "@components/Brand";
import { AuthNavigatorRoutes } from "@routes/auth.routes";

export function SignIn() {
  const { navigate } = useNavigation<AuthNavigatorRoutes>();

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10} pb={16}>
        <Brand />

        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Acesse sua conta
          </Heading>

          <Input
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input placeholder="Senha" secureTextEntry />

          <Button title="Acessar" />
        </Center>

        <Center mt={24}>
          <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
            Ainda não tem acesso?
          </Text>
          <Button
            title="Criar conta"
            variant="outline"
            onPress={() => navigate("SignUp")}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}
