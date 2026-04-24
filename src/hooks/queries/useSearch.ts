import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { searchService } from "@/apis/searchService";

export const useSearchClans = (query: string) => {
  return useQuery({
    queryKey: ["search", "clans", query],
    queryFn: () => searchService.searchClans(query),
    enabled: query.length > 0,
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useSearchPlayers = (query: string) => {
  return useQuery({
    queryKey: ["search", "players", query],
    queryFn: () => searchService.searchPlayers(query),
    enabled: query.length > 0,
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000, // 1 minute
  });
};
