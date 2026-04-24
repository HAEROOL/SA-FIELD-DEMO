import { axiosInstance } from "./instance";
import {
  CommentSaveRequestDto,
  CommentUpdateRequestDto,
} from "./types/comment.type";

export const commentService = {
  createComment: async (
    postId: number,
    payload: CommentSaveRequestDto
  ): Promise<void> => {
    await axiosInstance.post(`/comment/${postId}`, payload);
  },

  updateComment: async (
    commentId: number,
    payload: CommentUpdateRequestDto
  ): Promise<string> => {
    const { data } = await axiosInstance.patch(`/comment/${commentId}`, payload);
    return data;
  },

  deleteComment: async (commentId: number, password: string): Promise<void> => {
    await axiosInstance.delete(`/comment/${commentId}`, {
      params: { password },
    });
  },
};
