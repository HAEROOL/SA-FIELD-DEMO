import { axiosInstance } from "./instance";
import {
  PlayerInfo,
  PlayerMatch,
  PlayerSearchResponse,
  PaginatedResponse,
} from "./types/user.type";

export const userService = {
  // 닉네임으로 플레이어 검색
  searchPlayer: async (nickname: string): Promise<PlayerSearchResponse> => {
    const { data } = await axiosInstance.get(`/player/search`, {
      params: { nickname },
    });
    
    // API 응답의 nexon_ouid를 nexonOuid로 변환
    return {
      ...data,
      nexonOuid: data.nexon_ouid
    };
  },

  // 플레이어 상세 정보 (ouid로 조회)
  getPlayerInfo: async (ouid: string): Promise<PlayerInfo> => {
    const { data } = await axiosInstance.get(`/player/${ouid}/info`);

    // API 응답의 nexon_ouid(snake) 또는 nexonOuid(camel) 모두 처리
    return {
      ...data,
      nexonOuid: data.nexon_ouid ?? data.nexonOuid,
    };
  },

  // 플레이어 매치 히스토리
  getPlayerMatches: async (
    ouid: string,
    page: number = 0,
    size: number = 10,
    t?: number
  ): Promise<PaginatedResponse<PlayerMatch>> => {
    const { data } = await axiosInstance.get(`/player/${ouid}/match`, {
      params: { page, size, ...(t ? { t } : {}) },
    });
    return data;
  },
};
