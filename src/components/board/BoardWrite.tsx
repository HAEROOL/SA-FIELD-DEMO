"use client";


import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import TiptapEditor from "./TiptapEditor";
import { cn } from "@/components/ui/utils";
import { useRef, useState } from "react";
import { BoardType, ImageDto, PostInfoResponseDto } from "@/apis/types/post.type";
import { useCreatePost, useUpdatePost } from "@/hooks/mutations/usePost";
import { useEffect } from "react";
import { getProxiedImageUrl } from "@/utils/image";
import { useAlert } from "@/contexts/AlertContext";

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();

// HTML 본문에 실제로 존재하는 이미지만 필터링
const filterUsedImages = (html: string, images: ImageDto[]): ImageDto[] => {
  const srcSet = new Set<string>();
  const regex = /<img[^>]+src=["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    srcSet.add(match[1]);
  }
  return images.filter((img) => srcSet.has(getProxiedImageUrl(img.accessUrl)));
};

const BOARD_ID_MAP: Record<string, string> = {
  DAERUL: "daerul",
  RANKED: "ranked",
  THIRD_DIVISION: "third",
  A_SUPPLY: "asupply",
  FREE: "free",
  BROADCAST: "broadcast",
  STRATEGY: "strategy",
  NOTICE: "notice",
};

const BOARD_PARAM_TO_TYPE_MAP: Record<string, BoardType> = {
  daerul: "DAERUL",
  ranked: "RANKED",
  third: "THIRD_DIVISION",
  asupply: "A_SUPPLY",
  free: "FREE",
  broadcast: "BROADCAST",
  strategy: "STRATEGY",
  notice: "NOTICE",
};

const DESC_TO_ID_MAP: Record<string, string> = {
  "대룰": "daerul",
  "랭크전": "ranked",
  "3부": "third",
  "A보급": "asupply",
  "자유": "free",
  "방송": "broadcast",
  "전략": "strategy",
  "공지사항": "notice",
};

const DESC_TO_TYPE_MAP: Record<string, BoardType> = {
  "대룰": "DAERUL",
  "랭크전": "RANKED",
  "3부": "THIRD_DIVISION",
  "A보급": "A_SUPPLY",
  "자유": "FREE",
  "방송": "BROADCAST",
  "전략": "STRATEGY",
  "공지사항": "NOTICE",
};

const formSchema = z.object({
  boardType: z.string().min(1, "게시판을 선택해주세요."),
  password: z.string().min(4, "비밀번호는 최소 4자 이상이어야 합니다.").max(20, "비밀번호는 20자를 초과할 수 없습니다."),
  title: z
    .string()
    .trim()
    .min(1, "제목을 입력해주세요.")
    .max(100, "제목은 100자를 초과할 수 없습니다."),
  content: z
    .string()
    .refine((val) => stripHtml(val).length > 0, { message: "내용을 입력해주세요." })
    .refine((val) => stripHtml(val).length <= 20000, { message: "내용은 20,000자를 초과할 수 없습니다." }),
});

type FormValues = z.infer<typeof formSchema>;

interface BoardWriteProps {
  postId?: number;
  initialData?: PostInfoResponseDto;
  initialPassword?: string;
}

export default function BoardWrite({
  postId,
  initialData,
  initialPassword,
}: BoardWriteProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showAlert } = useAlert();
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [fromBoard, setFromBoard] = useState<string | undefined>(undefined);
  const uploadedImagesRef = useRef<ImageDto[]>(initialData?.images ?? []);
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost(postId || 0);
  const isEditMode = !!postId && !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      boardType: initialData?.boardDesc ? (DESC_TO_TYPE_MAP[initialData.boardDesc] || "") : "",
      password: initialPassword ?? "",
      title: initialData?.title || "",
      content: initialData?.content || "",
    },
  });

  // URL 쿼리 파라미터에서 초기 게시판 타입 설정
  useEffect(() => {
    if (!initialData) {
      const from = searchParams.get("from");
      const type = searchParams.get("type");
      if (from) setFromBoard(from);
      if (type) {
        const boardType = BOARD_PARAM_TO_TYPE_MAP[type];
        if (boardType) setValue("boardType", boardType);
      }
    } else if (isEditMode && initialData.boardDesc) {
      const type = DESC_TO_TYPE_MAP[initialData.boardDesc];
      if (type) setValue("boardType", type);
    }
  }, [searchParams, initialData, setValue, isEditMode, postId]);

  const content = watch("content");
  const title = watch("title");

  const onSubmit = (data: FormValues) => {
    if (isImageUploading) {
      showAlert("이미지 업로드가 완료될 때까지 기다려주세요.");
      return;
    }

    const usedImages = filterUsedImages(data.content, uploadedImagesRef.current);
    const images = usedImages.length > 0 ? usedImages : undefined;

    if (isEditMode) {
      updatePostMutation.mutate(
        { title: data.title, content: data.content, password: data.password, images },
        {
          onSuccess: () => {
            const targetFrom = fromBoard || DESC_TO_ID_MAP[initialData.boardDesc] || "popular";
            router.push(`/board/${postId}?from=${targetFrom}`);
          },
        }
      );
    } else {
      createPostMutation.mutate(
        {
          title: data.title,
          content: data.content,
          boardType: data.boardType as BoardType,
          password: data.password,
          images,
        },
        {
          onSuccess: (newPostId) => {
            const targetFrom = fromBoard || BOARD_ID_MAP[data.boardType] || "popular";
            router.push(`/board/${newPostId}?from=${targetFrom}`);
          },
        }
      );
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        {isEditMode ? "게시글 수정" : "게시글 작성"}
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700 p-6"
      >
        {/* Board Select & Auth Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <select
              {...register("boardType")}
              disabled={isEditMode}
              className={cn(
                "w-full bg-gray-50 dark:bg-brand-900 text-gray-700 dark:text-gray-300 text-sm border px-3 py-2 focus:outline-none focus:border-brand-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                errors.boardType
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              )}
            >
              <option value="">게시판 선택</option>
              {/* 수정 모드일 때는 원래 게시판 정보를 보여주기 위해 임시로 모든 옵션을 렌더링하거나, 
                  API 응답에 boardType이 명시적으로 없다면 굳이 보여줄 필요가 없을 수도 있음.
                  하지만 UI 일관성을 위해 유지하고 disable 처리.
                  initialData에 boardType이 없으므로, 적절히 처리 필요 (여기서는 생략하거나 'FREE' 등으로 매핑 필요할 수 있음)
                  *현재 API DTO에는 boardType이 응답에 없음 (boardDesc만 있음). 
                  따라서 수정 모드에서는 'FREE' 나 기타 값으로 고정되거나, boardDesc를 역매핑해야 함. 
                  하지만 boardType을 수정 API에 보내지 않으므로 큰 문제는 없음.
               */}
              <option value="FREE">자유게시판</option>
              <option value="RANKED">랭크전게시판</option>
              <option value="THIRD_DIVISION">3부게시판</option>
              <option value="A_SUPPLY">A보급게시판</option>
              <option value="DAERUL">대룰게시판</option>
              <option value="BROADCAST">방송게시판</option>
              <option value="STRATEGY">공략게시판</option>
            </select>
            {errors.boardType && (
              <p className="text-red-500 text-xs mt-1">
                {errors.boardType.message}
              </p>
            )}
            {isEditMode && (
              <p className="text-[10px] text-gray-400 mt-1">
                ※ 게시판 종류는 변경할 수 없습니다.
              </p>
            )}
          </div>
        </div>

        {/* Hidden username field for accessibility (Chrome requirement for password fields) */}
        <input 
          type="text" 
          name="username" 
          autoComplete="username" 
          className="hidden" 
          value="익명사용자" 
          readOnly 
          tabIndex={-1}
        />

        {/* Anonymous User Inputs */}
        <div className="flex flex-col md:flex-row gap-4 mb-4 p-4 bg-gray-50 dark:bg-brand-900/50 border border-gray-200 dark:border-gray-700/50">
            <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">
              비밀번호 {!isEditMode && "(4자 이상)"}
            </label>
            <div className="relative">
              <input
                type="password"
                autoComplete="current-password"
                {...register("password")}
                maxLength={20}
                disabled={isEditMode}
                className={cn(
                  "w-full bg-white dark:bg-brand-900 text-gray-900 dark:text-white text-sm border px-3 py-2 focus:outline-none focus:border-brand-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                )}
                placeholder="비밀번호 입력"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            {!isEditMode && (
              <p className="text-[10px] text-gray-400 mt-1">
                ※ 쉬운 비밀번호(1111, 1234 등) 사용을 지양해주세요.
              </p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            {...register("title")}
            maxLength={100}
            placeholder="제목을 입력하세요"
            className={cn(
              "w-full bg-white dark:bg-brand-900 text-gray-900 dark:text-white text-lg font-bold border px-4 py-3 focus:outline-none focus:border-brand-500 transition-colors",
              errors.title
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            )}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.title
              ? <p className="text-red-500 text-xs">{errors.title.message}</p>
              : <span />
            }
            <span className="text-xs text-gray-400">{(title ?? "").length}/100</span>
          </div>
        </div>

        {/* WYSIWYG Editor */}
        <div className="mb-6">
          <TiptapEditor
            content={content}
            onChange={(value) => setValue("content", value)}
            onUploadStateChange={setIsImageUploading}
            onImageUploaded={(img) => {
              if (!uploadedImagesRef.current.some((existing) => existing.saveFileName === img.saveFileName)) {
                uploadedImagesRef.current.push(img);
              }
            }}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.content
              ? <p className="text-red-500 text-xs">{errors.content.message}</p>
              : <span />
            }
            <span className="text-xs text-gray-400">{stripHtml(content ?? "").length.toLocaleString()}/20,000</span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
             type="button"
             onClick={() => router.back()}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white font-bold transition flex items-center justify-center"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={updatePostMutation.isPending || createPostMutation.isPending || isImageUploading}
            className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImageUploading
              ? "이미지 업로드 중..."
              : updatePostMutation.isPending || createPostMutation.isPending
              ? isEditMode
                ? "수정 중..."
                : "등록 중..."
              : isEditMode
              ? "수정"
              : "등록"}
          </button>
        </div>
      </form>
    </>
  );
}
