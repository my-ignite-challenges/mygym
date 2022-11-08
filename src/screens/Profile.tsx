import { useState } from "react";

import { TouchableOpacity } from "react-native";

import {
  Center,
  Heading,
  ScrollView,
  Skeleton,
  Text,
  VStack,
} from "native-base";

import { Avatar } from "@components/Avatar";
import { Button } from "@components/Button";
import { Header } from "@components/Header";
import { Input } from "@components/Input";

const AVATAR_SIZE = 33;

export function Profile() {
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);

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
              source={{ uri: "https://github.com/georgewfsantos.png" }}
              alt="Imagem do usuário"
              size={AVATAR_SIZE}
            />
          )}

          <TouchableOpacity>
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
          <Input bg="gray.600" placeholder="Nome" />
          <Input bg="gray.600" placeholder="Email" isDisabled />
        </Center>

        <VStack px={10} mt={12} mb={9}>
          <Heading color="gray.200" fontSize="md" mb={2}>
            Alterar senha
          </Heading>

          <Input bg="gray.600" placeholder="Senha antiga" secureTextEntry />
          <Input bg="gray.600" placeholder="Nova senha" secureTextEntry />
          <Input
            bg="gray.600"
            placeholder="Confirme a nova senha"
            secureTextEntry
          />
          <Button title="Atualizar" mt={4} />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
