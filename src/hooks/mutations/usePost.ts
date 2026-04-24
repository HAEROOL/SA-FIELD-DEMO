import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { postService } from "@/apis/postService";
import { PostCreateRequestDto, PostUpdateRequestDto } from "@/apis/types/post.type";
import { ApiErrorResponse, getApiErrorMessage } from "@/apis/types/error.type";
import { useAlert } from "@/contexts/AlertContext";

export const useCreatePost = () => {
  const { showAlert } = useAlert();

  return useMutation({
    mutationFn: (payload: PostCreateRequestDto) => postService.createPost(payload),
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error("Failed to create post:", error);
      showAlert(getApiErrorMessage(error, "게시글 등록에 실패했습니다. 다시 시도해주세요."));
    },
  });
};

export const useUpdatePost = (id: number) => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  return useMutation({
    mutationFn: (payload: PostUpdateRequestDto) => postService.updatePost(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error("Failed to update post:", error);
      showAlert(getApiErrorMessage(error, "게시글 수정에 실패했습니다. 비밀번호를 확인해주세요."));
    },
  });
};

export const useDeletePost = (id: number) => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  return useMutation({
    mutationFn: (password: string) => postService.deletePost(id, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error("Failed to delete post:", error);
      showAlert(getApiErrorMessage(error, "게시글 삭제에 실패했습니다. 비밀번호를 확인해주세요."));
    },
  });
};
