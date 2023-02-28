import { useCallback, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { Heading, VStack, SectionList, Text, useToast } from "native-base";

import { Header } from "@components/Header";
import { HistoryCard } from "@components/HistoryCard";
import { AppError } from "@utils/AppError";
import { Loading } from "@components/Loading";
import { api } from "@services/api";

export type HistoryItem = {
  id: string;
  name: string;
  group: string;
  hour: string;
  created_at: string;
};

type History = {
  title: string;
  data: HistoryItem[];
};

export function History() {
  const [isHistoryDataLoading, setIsHistoryDataLoading] = useState(false);

  const [history, setHistory] = useState<History[]>([]);

  const toast = useToast();

  async function fetchHistory() {
    try {
      setIsHistoryDataLoading(true);

      const response = await api.get("/history");

      setHistory(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;

      const toastTitle = isAppError
        ? error.message
        : "Não foi possível carregar os dados do histórico";

      toast.show({
        title: toastTitle,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsHistoryDataLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  return (
    <VStack flex={1}>
      <Header title="Histórico de Exercícios" />

      {isHistoryDataLoading ? (
        <Loading />
      ) : (
        <SectionList
          sections={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryCard data={item} />}
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
      )}
    </VStack>
  );
}
