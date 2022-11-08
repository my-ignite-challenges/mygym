import { useState } from "react";

import { Heading, VStack, SectionList, Text } from "native-base";

import { Header } from "@components/Header";
import { HistoryCard } from "@components/HistoryCard";

export function History() {
  const [history, setHistory] = useState([
    {
      title: "28.10.2022",
      data: [{ group: "Costas", title: "Puxada Frontal", time: "08:56" }],
    },
    {
      title: "29.10.2022",
      data: [{ group: "Triceps", title: "Triceps coice", time: "10:00" }],
    },
  ]);

  return (
    <VStack flex={1}>
      <Header title="Histórico de Exercícios" />

      <SectionList
        sections={history}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => <HistoryCard />}
        renderSectionHeader={({ section }) => (
          <Heading color="gray.200" fontSize="md" mt={10} mb={3}>
            {section.title}
          </Heading>
        )}
        px={8}
        contentContainerStyle={
          !history.length && { flex: 1, justifyContent: "center" }
        }
        ListEmptyComponent={() => (
          <Text color="gray.100" textAlign="center">
            Não há exercícios registrados ainda. {"\n"} Vamos fazer exercícios
            hoje?
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  );
}
