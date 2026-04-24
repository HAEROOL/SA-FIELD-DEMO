import { axiosInstance } from "./instance";
import { ClanInfo, ClanMember, ClanMatch } from "./types/clan.type";

export const clanService = {
  getClanInfo: async (clanId: string): Promise<ClanInfo> => {
    const { data } = await axiosInstance.get(`/clan/${clanId}/info`);
    return data;
  },

  getClanMembers: async (clanId: string): Promise<ClanMember[]> => {
    const { data } = await axiosInstance.get(`/clan/${clanId}/members`);
    return Array.isArray(data)
      ? data.map((item: any) => ({
          ...item,
          nexonOuid: item.nexon_ouid ?? item.nexonOuid ?? undefined,
        }))
      : data;
  },

  getClanMatches: async (
    clanId: string,
    page: number = 0,
    size: number = 10,
    t?: number
  ): Promise<ClanMatch[]> => {
    const { data } = await axiosInstance.get(`/clan/${clanId}/match`, {
      params: { page, size, ...(t ? { t } : {}) },
    });
    return Array.isArray(data)
      ? data.map((match: any) => ({
          ...match,
          participants: Array.isArray(match.participants)
            ? match.participants.map((p: any) => ({
                ...p,
                nexonOuId: p.nexon_ouid ?? p.nexonOuId ?? undefined,
              }))
            : match.participants,
        }))
      : data;
  },
};
