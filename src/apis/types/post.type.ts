// 게시판 타입 (boardapi.json의 enum에 맞춤)
export type BoardType =
  | "NOTICE"
  | "FREE"
  | "STRATEGY"
  | "THIRD_DIVISION"
  | "A_SUPPLY"
  | "RANKED"
  | "DAERUL"
  | "BROADCAST";

// 이미지 DTO
export interface ImageDto {
  accessUrl: string;
  saveFileName: string;
  originalFileName: string;
}

// 게시글 응답 DTO (목록용)
export interface PostResponseDto {
  postId: number;
  title: string;
  authorName: string;
  viewCount: number;
  boardDesc: string;
  likeCount: number;
  dislikeCount: number;
  createdAt: string;
  commentCnt?: number;
  hasImg: boolean;
}

// 댓글 응답 DTO
export interface CommentResponseDto {
  commentId: number;
  content: string;
  authorName: string;
  createdAt: string;
  isUpdated?: boolean;
  parentId?: number | null;
  children?: CommentResponseDto[];
}

// 게시글 상세 응답 DTO
export interface PostInfoResponseDto {
  postId: number;
  title: string;
  content: string;
  authorName: string;
  viewCount: number;
  boardDesc: string;
  likeCount: number;
  dislikeCount: number;
  createdAt: string;
  myVote?: "LIKE" | "DISLIKE" | null;
  images?: ImageDto[];
  comments: CommentResponseDto[];
}

// 게시글 생성 요청 DTO
export interface PostCreateRequestDto {
  title: string;
  content: string;
  boardType: BoardType;
  password: string;
  images?: ImageDto[];
}

// 게시글 수정 요청 DTO
export interface PostUpdateRequestDto {
  title: string;
  content: string;
  password: string;
  images?: ImageDto[];
}

// 이미지 업로드 응답 DTO
export interface ImageUploadResponseDto {
  accessUrl: string;
  saveFileName: string;
  originalFileName: string;
}

// 페이지네이션 관련 타입 (인기 게시판용)
export interface PageableObject {
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
  offset: number;
  sort: SortObject;
}

export interface SortObject {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface PagePostResponseDto {
  totalPages: number;
  totalElements: number;
  pageable: PageableObject;
  numberOfElements: number;
  size: number;
  content: PostResponseDto[];
  number: number;
  sort: SortObject;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface BoardListResponseDto {
  notices: PagePostResponseDto;
  posts: PagePostResponseDto;
}

export type SearchTarget = "title" | "title_content";

export interface PostSearchParams {
  boardCode: number;
  searchTarget: SearchTarget;
  keyword: string;
  page?: number;
  size?: number;
}

export interface PostSearchResponseDto {
  notices: PagePostResponseDto;
  posts: PagePostResponseDto;
}
