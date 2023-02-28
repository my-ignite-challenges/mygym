import { useEffect, useState } from "react";

import { TouchableOpacity } from "react-native";

import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  VStack,
  Text,
  Icon,
  HStack,
  Heading,
  Image,
  Box,
  useToast,
} from "native-base";

import { Button } from "@components/Button";
import { api } from "@services/api";
import { Loading } from "@components/Loading";
import { AppNavigatorRoutes } from "@routes/app.routes";
import { AppError } from "@utils/AppError";
import { Exercise as ExerciseProps } from "./Home";

import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepetitionsSvg from "@assets/repetitions.svg";

type RouteParams = {
  exerciseId: string;
};

export function Exercise() {
  const [isExerciseDataLoading, setIsExerciseDataLoading] = useState(false);
  const [isBeingSubmittedToHistory, setIsBeingSubmittedToHistory] =
    useState(false);
  const [exercise, setExercise] = useState<ExerciseProps>({} as ExerciseProps);

  const { goBack, navigate } = useNavigation<AppNavigatorRoutes>();
  const route = useRoute();
  const toast = useToast();

  const { exerciseId } = route.params as RouteParams;

  async function fetchExerciseDetails() {
    try {
      setIsExerciseDataLoading(true);
      const response = await api.get(`/exercises/${exerciseId}`);
      setExercise(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;

      const toastTitle = isAppError
        ? error.message
        : "Não foi possível carregar os dados do exercício.";

      toast.show({
        title: toastTitle,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsExerciseDataLoading(false);
    }
  }

  async function handleExerciseHistoryRegistration() {
    try {
      setIsBeingSubmittedToHistory(true);
      const response = await api.post("/history", { exercise_id: exerciseId });

      toast.show({
        title: "O exercício foi adicionado ao histórico.",
        placement: "top",
        bgColor: "green.700",
      });

      navigate("History");
    } catch (error) {
      const isAppError = error instanceof AppError;

      const toastTitle = isAppError
        ? error.message
        : "Não foi possível adicionar a conclusão do exercício ao histórico.";

      toast.show({
        title: toastTitle,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsBeingSubmittedToHistory(false);
    }
  }

  useEffect(() => {
    fetchExerciseDetails();
  }, [exerciseId]);

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
            {exercise.name}
          </Heading>

          <HStack alignItems="center">
            <BodySvg />
            <Text color="gray.200" ml={1} textTransform="capitalize">
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      {isExerciseDataLoading ? (
        <Loading />
      ) : (
        <VStack p={8}>
          <Box mb={3} rounded="lg" overflow="hidden">
            <Image
              source={{
                uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`,
              }}
              alt="Gif do Exercício"
              w="full"
              h={80}
              resizeMode="cover"
            />
          </Box>

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
                  {exercise.series} séries
                </Text>
              </HStack>
              <HStack>
                <RepetitionsSvg />
                <Text color="gray.200" ml={2}>
                  {exercise.repetitions} repetições
                </Text>
              </HStack>
            </HStack>
            <Button
              title="Marcar como realizado"
              isLoading={isBeingSubmittedToHistory}
              onPress={handleExerciseHistoryRegistration}
            />
          </Box>
        </VStack>
      )}
    </VStack>
  );
}
