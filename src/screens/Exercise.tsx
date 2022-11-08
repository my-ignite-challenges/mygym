import { TouchableOpacity } from "react-native";

import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { VStack, Text, Icon, HStack, Heading, Image, Box } from "native-base";

import { Button } from "@components/Button";

import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepetitionsSvg from "@assets/repetitions.svg";

export function Exercise() {
  const { goBack } = useNavigation();

  return (
    <VStack flex={1}>
      <VStack px={8} bg="gray.600" pt={12}>
        <TouchableOpacity onPress={goBack}>
          <Icon as={Feather} name="arrow-left" color="green.500" size={6} />
        </TouchableOpacity>
        <HStack
          mt={4}
          mb={8}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading color="gray.100" fontSize="lg" flexShrink={1}>
            Remada Unilateral
          </Heading>

          <HStack alignItems="center">
            <BodySvg />
            <Text color="gray.200" ml={1} textTransform="capitalize">
              Costas
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <VStack p={8}>
        <Image
          source={{
            uri: "https://media.istockphoto.com/id/615883260/pt/foto/difficult-doesnt-mean-impossible.jpg?s=612x612&w=0&k=20&c=O6RRjj3CwOaNXkpmHOTZNdFUcTyZTuGImlNkgMMEFwY=",
          }}
          alt="Imagem do Exercício"
          w="full"
          h={80}
          mb={3}
          resizeMode="cover"
          rounded="lg"
        />

        <Box bg="gray.600" rounded="md" pb={4} px={4}>
          <HStack
            justifyContent="space-around"
            alignItems="center"
            mb={6}
            mt={5}
          >
            <HStack>
              <SeriesSvg />
              <Text color="gray.200" ml={2}>
                3 séries
              </Text>
            </HStack>
            <HStack>
              <RepetitionsSvg />
              <Text color="gray.200" ml={2}>
                12 repetições
              </Text>
            </HStack>
          </HStack>
          <Button title="Marcar como realizado" />
        </Box>
      </VStack>
    </VStack>
  );
}
