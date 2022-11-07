import { VStack, Center, Heading, ScrollView } from "native-base";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { Brand } from "@components/Brand";
import { useNavigation } from "@react-navigation/native";

export function SignUp() {
  const { goBack } = useNavigation();

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

          <Input placeholder="E-mail" keyboardType="email-address" />

          <Input placeholder="Nome" autoCapitalize="none" />

          <Input placeholder="Senha" secureTextEntry />

          <Button title="Criar e acessar" />
        </Center>

        <Button
          title="Voltar para o login"
          variant="outline"
          mt={24}
          onPress={goBack}
        />
      </VStack>
    </ScrollView>
  );
}
