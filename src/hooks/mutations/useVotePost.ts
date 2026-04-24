import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { postService } from "@/apis/postService";
import { PostInfoResponseDto } from "@/apis/types/post.type";
import { useAlert } from "@/contexts/AlertContext";

const DEBOUNCE_MS = 500;

const calcVotedState = (
  old: PostInfoResponseDto,
  voteType: "LIKE" | "DISLIKE"
): Pick<PostInfoResponseDto, "likeCount" | "dislikeCount" | "myVote"> => {
  const isToggleOff = old.myVote === voteType;
  if (isToggleOff) {
    return {
      likeCount: voteType === "LIKE" ? old.likeCount - 1 : old.likeCount,
      dislikeCount: voteType === "DISLIKE" ? old.dislikeCount - 1 : old.dislikeCount,
      myVote: null,
    };
  }
  return {
    likeCount:
      voteType === "LIKE" ? old.likeCount + 1 :
      old.myVote === "LIKE" ? old.likeCount - 1 : old.likeCount,
    dislikeCount:
      voteType === "DISLIKE" ? old.dislikeCount + 1 :
      old.myVote === "DISLIKE" ? old.dislikeCount - 1 : old.dislikeCount,
    myVote: voteType,
  };
};

export const useVotePost = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 디바운스 시작 시점 스냅샷 (에러 시 롤백용)
  const snapshotRef = useRef<PostInfoResponseDto | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const { mutate } = useMutation({
    mutationFn: ({ postId, voteType }: { postId: number; voteType: "LIKE" | "DISLIKE" }) =>
      postService.votePost(postId, voteType),
    onError: (error, { postId }) => {
      if (snapshotRef.current) {
        queryClient.setQueryData(["post", postId], snapshotRef.current);
        snapshotRef.current = null;
      }
      console.error("Failed to vote:", error);
      showAlert("투표 처리에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });

  const vote = ({ postId, voteType }: { postId: number; voteType: "LIKE" | "DISLIKE" }) => {
    const current = queryClient.getQueryData<PostInfoResponseDto>(["post", postId]);
    if (!current) return;

    // 새 디바운스 사이클 시작 시에만 스냅샷 저장
    if (!timerRef.current) {
      snapshotRef.current = current;
    }

    // 현재 캐시 기준으로 즉시 UI 반영 (연속 클릭 시 토글 정확도 보장)
    queryClient.setQueryData(["post", postId], (prev: PostInfoResponseDto | undefined) =>
      prev ? { ...prev, ...calcVotedState(prev, voteType) } : prev
    );

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      const finalState = queryClient.getQueryData<PostInfoResponseDto>(["post", postId]);
      const snapshotMyVote = snapshotRef.current?.myVote ?? null;
      const finalMyVote = finalState?.myVote ?? null;

      // 최종 상태가 초기 상태와 동일하면 API 호출 불필요
      if (finalMyVote === snapshotMyVote) return;

      // finalMyVote가 null이면 스냅샷 vote를 다시 보내서 서버에서 토글 오프
      mutate({ postId, voteType: finalMyVote ?? (snapshotMyVote as "LIKE" | "DISLIKE") });
    }, DEBOUNCE_MS);
  };

  return { mutate: vote };
};
