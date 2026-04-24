export interface CommentSaveRequestDto {
  content: string;
  authorName?: string | null;
  password?: string;
  parentId?: number | null;
}

export interface CommentUpdateRequestDto {
  content: string;
  password?: string;
}
