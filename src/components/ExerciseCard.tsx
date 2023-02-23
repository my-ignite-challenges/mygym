import { TouchableOpacity, TouchableOpacityProps } from "react-native";

import { Entypo } from "@expo/vector-icons";
import { Heading, HStack, Image, Text, VStack, Icon, Box } from "native-base";

import { Exercise } from "@screens/Home";
import { api } from "@services/api";

type Props = TouchableOpacityProps & {
  data: Exercise;
};

export function ExerciseCard({ data, ...props }: Props) {
  return (
    <TouchableOpacity {...props}>
      <HStack
        bg="gray.500"
        alignItems="center"
        p={2}
        pr={4}
        rounded="md"
        mb={3}
      >
        <Image
          source={{
            uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`,
          }}
          alt="Imagem de exercício"
          w={16}
          h={16}
          mr={4}
        />

        <VStack flex={1}>
          <Heading color="white" fontSize="lg">
            {data.name}
          </Heading>
          <Text color="white" fontSize="sm" mt={1} numberOfLines={2}>
            {data.series} Séries x {data.repetitions} repetições
          </Text>
        </VStack>
        <Icon as={Entypo} name="chevron-thin-right" color="gray.300" />
      </HStack>
    </TouchableOpacity>
  );
}
