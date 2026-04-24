"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePost } from "@/hooks/queries/usePosts";
import { useVotePost } from "@/hooks/mutations/useVotePost";
import {
  useCreateComment,
  useDeleteComment,
  useUpdateComment,
} from "@/hooks/mutations/useComment";
import { useState, useMemo } from "react";
import { CommentResponseDto } from "@/apis/types/post.type";
import { getProxiedImageUrl } from "@/utils/image";
import { sanitizeHtml } from "@/utils/sanitize";
import TimeAgo from "@/components/common/TimeAgo";
import InputModal from "@/components/common/InputModal";
import { useAlert } from "@/contexts/AlertContext";

interface BoardDetailProps {
  id: string;
  fromBoard?: string;
}

export default function BoardDetail({ id, fromBoard = "popular" }: BoardDetailProps) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const { data: post } = usePost(Number(id));

  const { mutate: votePost } = useVotePost();
  const { mutate: createComment, isPending: isCreatingComment } = useCreateComment();
  const { mutate: updateComment, isPending: isUpdatingComment } = useUpdateComment();
  const { mutate: deleteComment } = useDeleteComment();

  // 댓글 작성 상태
  const [commentContent, setCommentContent] = useState("");
  const [commentPassword, setCommentPassword] = useState("");

  // 댓글 수정 상태 (수정 중인 댓글 ID)
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editPassword, setEditPassword] = useState("");

  // 대댓글 작성 상태
  const [replyingCommentId, setReplyingCommentId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyPassword, setReplyPassword] = useState("");

  // 댓글 삭제 모달 상태
  const [deleteTargetCommentId, setDeleteTargetCommentId] = useState<number | null>(null);

  const rootComments = useMemo(
    () =>
      Array.from(new Map(post.comments.map((c) => [c.commentId, c])).values()).filter(
        (c) => !c.parentId
      ),
    [post.comments]
  );
  


  // 대댓글 작성 모드 진입
  const startReply = (commentId: number) => {
    setReplyingCommentId(commentId);
    setReplyContent("");
    setReplyPassword("");
    // 다른 모드 초기화
    setEditingCommentId(null);
  };

  // 대댓글 작성 취소
  const cancelReply = () => {
    setReplyingCommentId(null);
    setReplyContent("");
    setReplyPassword("");
  };

  // 대댓글 작성 핸들러
  const handleCreateReply = (parentId: number) => {
    if (!replyContent.trim()) {
      showAlert("댓글 내용을 입력해주세요.");
      return;
    }
    if (!replyPassword.trim()) {
      showAlert("비밀번호를 입력해주세요.");
      return;
    }

    createComment(
      {
        postId: Number(id),
        payload: {
          content: replyContent,
          password: replyPassword,
          parentId: parentId,
          authorName: null,
        },
      },
      {
        onSuccess: () => {
          setReplyingCommentId(null);
          setReplyContent("");
          setReplyPassword("");
        },
      }
    );
  };

  // 재귀적으로 댓글을 렌더링하는 함수
  const renderComments = (comments: CommentResponseDto[], depth: number = 0) => {
    return comments.map((comment) => {
      const isAuthor = comment.authorName === post.authorName;
      const isEditing = editingCommentId === comment.commentId;
      const isReplying = replyingCommentId === comment.commentId;

      return (
        <div key={comment.commentId}>
          <div 
             className={`p-4 transition border-b border-gray-100 dark:border-gray-700/50 ${
               depth > 0 ? "pl-8 bg-gray-50/50 dark:bg-brand-900/20" : ""
             }`}
             style={{ paddingLeft: `${1 + depth * 1.5}rem` }}
          >
            {isEditing ? (
              // 수정 모드
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateComment(comment.commentId);
                  }}
                  className="space-y-2"
                >
                  <div className="flex gap-2 mb-2">
                    <span className="font-bold text-gray-900 dark:text-white text-sm">
                      {comment.authorName} (수정 중)
                    </span>
                    <input
                      type="text"
                      autoComplete="username"
                      className="hidden"
                      readOnly
                    />
                    <input
                      type="password"
                      placeholder="비밀번호"
                      autoComplete="current-password"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="bg-white dark:bg-brand-800 text-gray-900 dark:text-white text-sm border border-gray-300 dark:border-gray-600 px-2 py-1 w-32 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <textarea
                    value={editContent}
                    maxLength={1000}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-white dark:bg-brand-800 text-gray-900 dark:text-white text-sm border border-gray-300 dark:border-gray-600 p-2 h-20 resize-none focus:outline-none focus:border-brand-500"
                  ></textarea>
                  <div className="flex justify-end items-center gap-2">
                    <span className="text-xs text-gray-400">{editContent.length.toLocaleString()}/1,000</span>
                    <button
                      type="button"
                      onClick={cancelEditComment}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white text-xs hover:bg-gray-300 transition"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdatingComment}
                      className="px-3 py-1 bg-brand-600 text-white text-xs hover:bg-brand-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdatingComment ? "저장 중..." : "저장"}
                    </button>
                  </div>
                </form>
            ) : (
              // 일반 모드
              <>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {/* 대댓글 아이콘 */}
                    {depth > 0 && <i className="fas fa-reply text-gray-400 rotate-180 mr-1"></i>}
                    
                    {isAuthor ? (
                      <>
                        <span className="font-bold text-brand-500 text-sm">
                          {comment.authorName}
                        </span>
                        <span className="px-1.5 py-0.5 bg-brand-500 text-white text-[10px] font-bold">
                          작성자
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-gray-900 dark:text-white text-sm">
                        {comment.authorName}
                      </span>
                    )}
                    <TimeAgo 
                      date={comment.createdAt} 
                      format="time" 
                      className="text-xs text-gray-500"
                    />
                  </div>
                  <div className="flex gap-2 text-xs text-gray-500">
                    {depth === 0 && (
                      <button
                        onClick={() => startReply(comment.commentId)}
                        className="hover:text-brand-500"
                      >
                        답글
                      </button>
                    )}
                    <button
                      onClick={() =>
                        startEditComment(comment.commentId, comment.content)
                      }
                      className="hover:text-gray-900 dark:hover:text-white"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.commentId)}
                      className="hover:text-red-500"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 whitespace-pre-wrap wrap-break-word">
                  {comment.content}
                  {comment.isUpdated && (
                    <span className="text-gray-400 text-xs ml-1">(수정됨)</span>
                  )}
                </p>
                
                {/* 대댓글 작성 폼 */}
                {isReplying && (
                    <form 
                      onSubmit={(e) => {
                         e.preventDefault();
                         handleCreateReply(comment.commentId);
                      }}
                      className="mt-3 p-3 bg-gray-100 dark:bg-brand-900/40 animate-fade-in-down"
                    >
                      <div className="flex gap-2 mb-2">
                         <span className="text-xs font-bold text-gray-500 flex items-center">
                            <i className="fas fa-reply mr-1"></i> 답글 작성
                         </span>
                         <input
                           type="text"
                           autoComplete="username"
                           className="hidden"
                           readOnly
                         />
                         <input
                          type="password"
                          placeholder="비밀번호"
                          autoComplete="new-password"
                          value={replyPassword}
                          onChange={(e) => setReplyPassword(e.target.value)}
                          className="bg-white dark:bg-brand-800 text-gray-900 dark:text-white text-xs border border-gray-300 dark:border-gray-600 px-2 py-1 w-24 focus:outline-none focus:border-brand-500"
                        />
                      </div>
                      <div className="relative">
                        <textarea
                          placeholder="답글 내용을 입력하세요."
                          value={replyContent}
                          maxLength={1000}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="w-full bg-white dark:bg-brand-800 text-gray-900 dark:text-white text-sm border border-gray-300 dark:border-gray-600 p-2 h-16 resize-none focus:outline-none focus:border-brand-500"
                        ></textarea>
                        <div className="flex justify-end items-center gap-2 mt-2">
                          <span className="text-xs text-gray-400">{replyContent.length.toLocaleString()}/1,000</span>
                          <button
                            type="button"
                            onClick={cancelReply}
                            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white text-xs hover:bg-gray-300 transition"
                          >
                            취소
                          </button>
                          <button
                            type="submit"
                            disabled={isCreatingComment}
                            className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isCreatingComment ? "등록 중..." : "등록"}
                          </button>
                        </div>
                      </div>
                    </form>
                )}
              </>
            )}
          </div>
          {/* 재귀 렌더링 */}
          {comment.children && comment.children.length > 0 && (
             <div>
                {renderComments(comment.children, depth + 1)}
             </div>
          )}
        </div>
      );
    });
  };

  // 게시글 수정 핸들러
  const handleEdit = () => {
    router.push(`/board/${id}/edit?from=${fromBoard}`);
  };

  // 게시글 삭제 핸들러
  const handleDelete = () => {
    router.push(`/board/${id}/delete?from=${fromBoard}`);
  };

  // 투표 핸들러
  const handleVote = (voteType: "LIKE" | "DISLIKE") => {
    votePost({ postId: Number(id), voteType });
  };

  // 댓글 작성 핸들러
  const handleCreateComment = () => {
    if (!commentContent.trim()) {
      showAlert("댓글 내용을 입력해주세요.");
      return;
    }
    if (!commentPassword.trim()) {
      showAlert("비밀번호를 입력해주세요.");
      return;
    }

    createComment(
      {
        postId: Number(id),
        payload: {
          content: commentContent,
          password: commentPassword,
          parentId: null, // 게시글 댓글(Root)은 null
          authorName: null,
        },
      },
      {
        onSuccess: () => {
          setCommentContent("");
          setCommentPassword("");
        },
      }
    );
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = (commentId: number) => {
    setDeleteTargetCommentId(commentId);
  };

  const handleDeleteCommentConfirm = (password: string) => {
    if (deleteTargetCommentId === null) return;
    deleteComment({
      commentId: deleteTargetCommentId,
      password,
      postId: Number(id),
    });
    setDeleteTargetCommentId(null);
  };

  // 댓글 수정 모드 진입
  const startEditComment = (commentId: number, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditContent(currentContent);
    setEditPassword("");
  };

  // 댓글 수정 취소
  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditContent("");
    setEditPassword("");
  };

  // 댓글 수정 저장
  const handleUpdateComment = (commentId: number) => {
    if (!editContent.trim()) {
      showAlert("댓글 내용을 입력해주세요.");
      return;
    }
    if (!editPassword.trim()) {
      showAlert("비밀번호를 입력해주세요.");
      return;
    }

    updateComment(
      {
        commentId,
        payload: {
          content: editContent,
          password: editPassword,
        },
        postId: Number(id),
      },
      {
        onSuccess: () => {
          setEditingCommentId(null);
          setEditContent("");
          setEditPassword("");
        },
      }
    );
  };

  // 날짜 관련 포맷팅 함수 제거 (TimeAgo 컴포넌트로 대체)

  // 조회수를 포맷팅하는 함수
  const formatViewCount = (count: number): string => {
    return count.toLocaleString();
  };

  return (
    <>
      <InputModal
        open={deleteTargetCommentId !== null}
        title="댓글을 삭제하려면 비밀번호를 입력하세요."
        type="password"
        placeholder="비밀번호"
        confirmLabel="삭제"
        onConfirm={handleDeleteCommentConfirm}
        onCancel={() => setDeleteTargetCommentId(null)}
      />

      <Link
        href={`/board?board=${fromBoard}`}
        className="mb-4 text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-white flex items-center gap-2 transition w-fit text-sm font-bold"
      >
        <i className="fas fa-list-ul"></i> 목록으로
      </Link>

      <div className="bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm mb-6">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 text-xs font-bold border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 shrink-0">
              {post.boardDesc}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white wrap-break-word min-w-0">
              {post.title}
            </h2>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <i className="fas fa-user"></i>{" "}
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  {post.authorName}
                </span>
              </span>
              <TimeAgo date={post.createdAt} format="detail" />
            </div>
            <div className="flex items-center gap-4">
              <span>
                조회 <span>{formatViewCount(post.viewCount)}</span>
              </span>
              <span className="flex items-center gap-1">
                <i className="fas fa-thumbs-up text-brand-win"></i> <span className="tabular-nums min-w-2 text-right">{post.likeCount}</span>
              </span>
              <span className="flex items-center gap-1">
                <i className="fas fa-thumbs-down text-brand-lose"></i> <span className="tabular-nums min-w-2 text-right">{post.dislikeCount}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div
          className="p-8 min-h-75 text-gray-800 dark:text-gray-200 leading-relaxed border-b border-gray-200 dark:border-gray-700 wrap-break-word overflow-x-auto [&_p]:min-h-[1em] [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-brand-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(
              post.content.replace(
                /<img[^>]+src="([^">]+)"/g,
                (match, src) => match.replace(src, getProxiedImageUrl(src))
              )
            )
          }}
        ></div>

        {/* Interaction Buttons */}
        <div className="p-6 flex justify-center gap-4 bg-gray-50 dark:bg-brand-900/30">
          <button
            onClick={() => handleVote("LIKE")}
            className={`flex flex-col items-center justify-center w-20 h-20 rounded-full border transition group shadow-sm ${
              post.myVote === "LIKE"
                ? "border-brand-win bg-brand-win/10 text-brand-win"
                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-brand-800 hover:border-brand-win hover:text-brand-win"
            }`}
          >
            <i className="fas fa-thumbs-up text-xl mb-1 group-hover:scale-110 transition-transform"></i>
            <span className="text-lg font-bold">{post.likeCount}</span>
          </button>
          <button
            onClick={() => handleVote("DISLIKE")}
            className={`flex flex-col items-center justify-center w-20 h-20 rounded-full border transition group shadow-sm ${
              post.myVote === "DISLIKE"
                ? "border-brand-lose bg-brand-lose/10 text-brand-lose"
                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-brand-800 hover:border-brand-lose hover:text-brand-lose"
            }`}
          >
            <i className="fas fa-thumbs-down text-xl mb-1 group-hover:scale-110 transition-transform"></i>
            <span className="text-lg font-bold">{post.dislikeCount}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-gray-50 dark:bg-brand-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <Link
            href={`/board?board=${fromBoard}`}
            className="px-4 py-2 bg-white dark:bg-brand-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-brand-700 text-gray-700 dark:text-gray-300 text-sm font-bold transition flex items-center gap-2"
          >
            <i className="fas fa-list-ul text-xs"></i> 목록
          </Link>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white text-sm font-bold transition"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-200 border border-red-200 dark:border-red-900 text-sm font-bold transition"
            >
              삭제
            </button>
          </div>
        </div>
      </div>

      {/* Comment Section */}
      <div className="bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-brand-900/50">
          <h3 className="font-bold text-gray-900 dark:text-white">
            <i className="fas fa-comments mr-2"></i>댓글{" "}
            <span className="text-brand-500">{post.comments.length}</span>
          </h3>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {renderComments(rootComments)}
        </div>

        {/* Comment Write Form (Root) */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateComment();
          }}
          className="p-4 bg-gray-50 dark:bg-brand-900 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              autoComplete="username"
              className="hidden"
              readOnly
            />
            <input
              type="password"
              placeholder="비밀번호"
              autoComplete="new-password"
              value={commentPassword}
              onChange={(e) => setCommentPassword(e.target.value)}
              className="bg-white dark:bg-brand-800 text-gray-900 dark:text-white text-sm border border-gray-300 dark:border-gray-600 px-3 py-1.5 w-32 focus:outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <textarea
              placeholder="댓글을 입력하세요."
              value={commentContent}
              maxLength={1000}
              onChange={(e) => setCommentContent(e.target.value)}
              className="w-full bg-white dark:bg-brand-800 text-gray-900 dark:text-white text-sm border border-gray-300 dark:border-gray-600 p-3 h-24 resize-none focus:outline-none focus:border-brand-500"
            ></textarea>
            <div className="flex justify-end items-center gap-2 mt-2">
              <span className="text-xs text-gray-400">{commentContent.length.toLocaleString()}/1,000</span>
              <button
                type="submit"
                disabled={isCreatingComment}
                className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold px-4 py-1.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingComment ? "등록 중..." : "등록"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
