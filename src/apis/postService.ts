import { axiosInstance } from "./instance";
import {
  PostInfoResponseDto,
  PostCreateRequestDto,
  PostUpdateRequestDto,
  ImageUploadResponseDto,
  BoardType,
  BoardListResponseDto,
  PostSearchParams,
  PostSearchResponseDto,
} from "./types/post.type";

export const postService = {
  /**
   * 게시판 목록 조회
   * @param type - 게시판 타입 (optional)
   * @param offset - 오프셋 (기본값: 0)
   */
  getBoardList: async (
    type?: BoardType,
    page: number = 0,
    size: number = 15
  ): Promise<BoardListResponseDto> => {
    const { data } = await axiosInstance.get("/post/list", {
      params: {
        type,
        page,
        size,
      },
    });
    return data;
  },

  /**
   * 게시글 상세 조회
   * @param id - 게시글 ID
   */
  getPostInfo: async (id: number): Promise<PostInfoResponseDto> => {
    const { data } = await axiosInstance.get("/post/info", {
      params: { id },
    });
    return data;
  },

  /**
   * 인기 게시글 목록 조회 (페이지네이션)
   * @param page - 페이지 번호 (기본값: 0)
   * @param size - 페이지 크기 (기본값: 10)
   */
  getTrendingPosts: async (
    page: number = 0,
    size: number = 10
  ): Promise<BoardListResponseDto> => {
    const { data } = await axiosInstance.get("/post/popular", {
      params: {
        page,
        size,
      },
    });
    return data;
  },

  /**
   * 게시글 작성
   * @param payload - 게시글 작성 데이터
   */
  createPost: async (payload: PostCreateRequestDto): Promise<number> => {
    const { data } = await axiosInstance.post("/post", payload);
    return data;
  },

  votePost: async (postId: number, voteType: "LIKE" | "DISLIKE"): Promise<string> => {
    const { data } = await axiosInstance.post(`/post/${postId}/vote`, null, {
      params: { voteType },
    });
    return data;
  },

  /**
   * 게시글 수정
   * @param id - 게시글 ID
   * @param payload - 게시글 수정 데이터
   */
  updatePost: async (
    id: number,
    payload: PostUpdateRequestDto
  ): Promise<number> => {
    const { data } = await axiosInstance.put(`/post/${id}`, payload);
    return data;
  },

  /**
   * 게시글 비밀번호 검증
   * @param id - 게시글 ID
   * @param password - 비밀번호
   */
  verifyPostPassword: async (id: number, password: string): Promise<{ valid: boolean; message: string; resultCode: string }> => {
    const { data } = await axiosInstance.post(`/post/${id}/verify`, { password });
    return data;
  },

  /**
   * 게시글 삭제
   * @param id - 게시글 ID
   * @param password - 비밀번호
   */
  deletePost: async (id: number, password: string): Promise<void> => {
    await axiosInstance.delete(`/post/${id}`, {
      params: { password },
    });
  },

  /**
   * 게시글 검색
   */
  searchPosts: async ({
    boardCode,
    searchTarget,
    keyword,
    page = 0,
    size = 15,
  }: PostSearchParams): Promise<PostSearchResponseDto> => {
    const { data } = await axiosInstance.get("/post/search", {
      params: { boardCode, searchTarget, keyword, page, size },
    });
    return data;
  },

  /**
   * 이미지 업로드
   * @param file - 업로드할 파일
   */
  uploadImage: async (file: File): Promise<ImageUploadResponseDto> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axiosInstance.post("/post/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },
};
