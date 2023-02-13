import { TouchableOpacity } from "react-native";

import { Heading, HStack, Icon, Text, VStack } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

import defaultAvatar from "@assets/defaultAvatar.png";
import { useAuth } from "@hooks/useAuth";
import { Avatar } from "./Avatar";

export function HomeHeader() {
  const { user, signOut } = useAuth();

  return (
    <HStack alignItems="center" bg="gray.600" pt={16} pb={5} px={8}>
      <Avatar
        source={user.avatar ? { uri: user.avatar } : defaultAvatar}
        alt="Imagem do usuário"
        size={16}
        mr={4}
      />
      <VStack flex={1}>
        <Text color="gray.100" fontSize="md">
          Olá,
        </Text>
        <Heading color="gray.100" fontSize="md">
          {user.name}
        </Heading>
      </VStack>
      <TouchableOpacity>
        <Icon
          name="logout"
          as={MaterialIcons}
          color="gray.200"
          size={7}
          onPress={signOut}
        />
      </TouchableOpacity>
    </HStack>
  );
}
