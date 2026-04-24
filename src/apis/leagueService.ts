import { axiosInstance } from "./instance";
import {
  LeagueClan,
  LeaguePlayer,
  LeagueTopResponse,
} from "./types/league.type";

export const leagueService = {
  getTopRankings: async (): Promise<LeagueTopResponse> => {
    const { data } = await axiosInstance.get("/league/top");
    return data;
  },

  getLeagueList: async (division: string): Promise<LeagueClan[]> => {
    const { data } = await axiosInstance.get(`/league/list`, {
      params: { division },
    });
    return data;
  },

  getPlayerList: async (
    page: number = 0,
    size: number = 20
  ): Promise<LeaguePlayer[]> => {
    const { data } = await axiosInstance.get(`/player/list`, {
      params: { page, size },
    });
    return Array.isArray(data)
      ? data.map((item: any) => ({
          ...item,
          nexonOuid: item.nexon_ouid ?? item.nexonOuid ?? "",
        }))
      : data;
  },
};
