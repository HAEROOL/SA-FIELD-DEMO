import { useSuspenseQuery } from "@tanstack/react-query";
import { leagueService } from "@/apis/leagueService";

export const useLeagueTop = () => {
  return useSuspenseQuery({
    queryKey: ["league", "top"],
    queryFn: leagueService.getTopRankings,
  });
};
