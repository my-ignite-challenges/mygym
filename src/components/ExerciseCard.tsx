import { TouchableOpacity, TouchableOpacityProps } from "react-native";

import { Entypo } from "@expo/vector-icons";
import { Heading, HStack, Image, Text, VStack, Icon } from "native-base";

type Props = TouchableOpacityProps & {};

export function ExerciseCard({ ...props }: Props) {
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
            uri: "https://media.istockphoto.com/id/615883260/pt/foto/difficult-doesnt-mean-impossible.jpg?s=612x612&w=0&k=20&c=O6RRjj3CwOaNXkpmHOTZNdFUcTyZTuGImlNkgMMEFwY=",
          }}
          alt="Exercise Image"
          w={16}
          h={16}
          mr={4}
        />

        <VStack flex={1}>
          <Heading color="white" fontSize="lg">
            Remada unilateral
          </Heading>
          <Text color="white" fontSize="sm" mt={1} numberOfLines={2}>
            3 Séries x 12 repetições
          </Text>
        </VStack>
        <Icon as={Entypo} name="chevron-thin-right" color="gray.300" />
      </HStack>
    </TouchableOpacity>
  );
}
