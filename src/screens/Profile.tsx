import { useState } from "react";

import { Alert, ImageProps, TouchableOpacity } from "react-native";
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

import { Avatar } from "@components/Avatar";
import { Button } from "@components/Button";
import { Header } from "@components/Header";
import { Input } from "@components/Input";

import defaultAvatar from "@assets/avatar-default.png";

const AVATAR_SIZE = 33;

export function Profile() {
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [avatar, setUserAvatar] = useState("");

  const toast = useToast();

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
        setUserAvatar(selectedPhoto.uri);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsAvatarLoading(false);
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
              source={avatar ? { uri: avatar } : defaultAvatar}
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
