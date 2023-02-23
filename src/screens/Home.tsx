import { useCallback, useEffect, useState } from "react";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { FlatList, Heading, HStack, Text, useToast, VStack } from "native-base";

import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/MuscleGroup";
import { ExerciseCard } from "@components/ExerciseCard";
import { AppNavigatorRoutes } from "@routes/app.routes";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { Loading } from "@components/Loading";

export type Exercise = {
  id: string;
  demo: string;
  group: string;
  name: string;
  repetitions: string;
  series: number;
  thumb: string;
};

export function Home() {
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("antebraço");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isExercisesDataLoading, setIsExercisesDataLoading] = useState(false);

  const { navigate } = useNavigation<AppNavigatorRoutes>();
  const toast = useToast();

  function handleShowExerciseDetails(id: string) {
    navigate("Exercise", { exerciseId: id });
  }

  async function fetchMuscleGroups() {
    try {
      const response = await api.get("/groups");

      setMuscleGroups(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const toastTitle = isAppError
        ? error.message
        : "Não foi possível carregar os dados dos grupos musculares";

      toast.show({
        title: toastTitle,
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  async function fetchExercisesByMuscleGroup() {
    try {
      setIsExercisesDataLoading(true);

      const response = await api.get(
        `/exercises/bygroup/${selectedMuscleGroup}`
      );
      setExercises(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const toastTitle = isAppError
        ? error.message
        : "Não foi possível carregar os exercícios desse grupo muscular.";

      toast.show({
        title: toastTitle,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsExercisesDataLoading(false);
    }
  }

  useEffect(() => {
    fetchMuscleGroups();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExercisesByMuscleGroup();
    }, [selectedMuscleGroup])
  );

  return (
    <VStack flex={1}>
      <HomeHeader />
      <FlatList
        data={muscleGroups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isSelected={selectedMuscleGroup === item}
            onPress={() => setSelectedMuscleGroup(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 8 }}
        my={10}
        maxHeight={10}
      />

      {isExercisesDataLoading ? (
        <Loading />
      ) : (
        <VStack flex={1} px={8}>
          <HStack justifyContent="space-between" mb={5}>
            <Heading color="gray.200" fontSize="md">
              Exercícios
            </Heading>
            <Text color="gray.200" fontSize="sm">
              {exercises.length}
            </Text>
          </HStack>

          <FlatList
            data={exercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExerciseCard
                onPress={() => handleShowExerciseDetails(item.id)}
                data={item}
              />
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{
              pb: 20,
            }}
          />
        </VStack>
      )}
    </VStack>
  );
}
