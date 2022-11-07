import { Heading, HStack, Icon, Text, VStack } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

import { Avatar } from "./Avatar";
import { TouchableOpacity } from "react-native";

export function HomeHeader() {
  return (
    <HStack alignItems="center" bg="gray.600" pt={16} pb={5} px={8}>
      <Avatar
        source={{ uri: "https://github.com/georgewfsantos.png" }}
        alt="User avatar"
        size={16}
        mr={4}
      />
      <VStack flex={1}>
        <Text color="gray.100" fontSize="md">
          Olá,
        </Text>
        <Heading color="gray.100" fontSize="md">
          Fulano
        </Heading>
      </VStack>
      <TouchableOpacity>
        <Icon name="logout" as={MaterialIcons} color="gray.200" size={7} />
      </TouchableOpacity>
    </HStack>
  );
}
