import { axiosInstance } from "./instance";
import { ClanSearchResult, PlayerSearchResult } from "./types/search.type";

export const searchService = {
  searchClans: async (query: string): Promise<ClanSearchResult[]> => {
    if (!query) return [];

    try {
      const { data } = await axiosInstance.get(`/clan/search/preview`, {
        params: { keyword: query },
      });

      return Array.isArray(data)
        ? data.map((item: any) => ({
            ...item,
            id: item.clanId.toString(), // Map for UI key
            name: item.clanName, // Map for UI display
            tier: "Unranked", // API doesn't return tier yet
            info: "Clan", // API doesn't return master name yet
          }))
        : [];
    } catch (error) {
      console.error("Clan search error:", error);
      return [];
    }
  },

  searchPlayers: async (query: string): Promise<PlayerSearchResult[]> => {
    if (!query) return [];

    try {
      const { data } = await axiosInstance.get(`/player/search/preview`, {
        params: { keyword: query },
      });

      return Array.isArray(data)
        ? data.map((item: any) => ({
            ...item,
            id: item.nexonOuid ?? item.playerId.toString(),
            name: item.nickName,
            tier: "Unranked", // API doesn't return rankStr
            info: item.clanName ? `Clan: ${item.clanName}` : "No Clan",
          }))
        : [];
    } catch (error) {
      console.error("Player search error:", error);
      return [];
    }
  },
};
