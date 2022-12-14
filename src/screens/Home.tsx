import { useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { FlatList, Heading, HStack, Text, VStack } from "native-base";

import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/MuscleGroup";
import { ExerciseCard } from "@components/ExerciseCard";
import { AppNavigatorRoutes } from "@routes/app.routes";

export function Home() {
  const [muscleGroups, setMuscleGroups] = useState([
    "Costas",
    "Ombros",
    "Bíceps",
    "Tríceps",
  ]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("Costas");
  const [exercises, setExercises] = useState([
    "Puxada frontal",
    "Remada curvada",
    "Remada unilateral",
    "Levantamento terra",
  ]);

  const { navigate } = useNavigation<AppNavigatorRoutes>();

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
          keyExtractor={(item) => item}
          renderItem={() => (
            <ExerciseCard onPress={() => navigate("Exercise")} />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{
            pb: 20,
          }}
        />
      </VStack>
    </VStack>
  );
}
