import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentService } from "@/apis/commentService";
import {
  CommentSaveRequestDto,
  CommentUpdateRequestDto,
} from "@/apis/types/comment.type";
import { AxiosError } from "axios";
import { ApiErrorResponse, getApiErrorMessage } from "@/apis/types/error.type";
import { useAlert } from "@/contexts/AlertContext";

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  return useMutation({
    mutationFn: ({
      postId,
      payload,
    }: {
      postId: number;
      payload: CommentSaveRequestDto;
    }) => commentService.createComment(postId, payload),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error("Failed to create comment:", error);
      showAlert(getApiErrorMessage(error, "댓글 등록에 실패했습니다."));
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  return useMutation({
    mutationFn: ({
      commentId,
      payload,
      postId,
    }: {
      commentId: number;
      payload: CommentUpdateRequestDto;
      postId: number;
    }) => commentService.updateComment(commentId, payload),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error("Failed to update comment:", error);
      showAlert(getApiErrorMessage(error, "비밀번호가 올바르지 않습니다."));
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  return useMutation({
    mutationFn: ({
      commentId,
      password,
    }: {
      commentId: number;
      password: string;
      postId: number;
    }) => commentService.deleteComment(commentId, password),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error("Failed to delete comment:", error);
      showAlert(getApiErrorMessage(error, "비밀번호가 올바르지 않습니다."));
    },
  });
};
