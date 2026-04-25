import type {
  PostResponseDto,
  PostInfoResponseDto,
  CommentResponseDto,
  BoardType,
  PostCreateRequestDto,
  PostUpdateRequestDto,
  ImageDto,
} from "@/apis/types/post.type";
import {
  BOARD_META,
  SEED_CLANS,
  SEED_PLAYERS,
  SEED_POSTS,
  type BoardKind,
  type SeedPlayer,
} from "./seed";
import type { ClanInfo } from "@/apis/types/clan.type";

interface Vote {
  postId: number;
  type: "LIKE" | "DISLIKE";
}

interface PostRecord {
  list: PostResponseDto;
  info: PostInfoResponseDto;
  password: string;
}

class DemoStore {
  readonly clans: ClanInfo[];
  readonly players: SeedPlayer[];
  readonly clanRefreshedAt = new Map<number, string>();
  readonly playerRefreshedAt = new Map<number, string>();

  private posts: Map<number, PostRecord> = new Map();
  private postOrder: number[] = [];
  private nextPostId: number;
  private nextCommentId: number;
  private votes: Map<string, Vote> = new Map(); // key = clientId:postId

  constructor() {
    this.clans = SEED_CLANS.map((c) => ({ ...c }));
    this.players = SEED_PLAYERS.map((p) => ({ ...p }));
    const { list, info } = SEED_POSTS;
    list.forEach((item) => {
      const detail = info.get(item.postId)!;
      this.posts.set(item.postId, {
        list: { ...item },
        info: { ...detail, comments: cloneComments(detail.comments) },
        password: "demo1234",
      });
      this.postOrder.push(item.postId);
    });
    this.nextPostId = Math.max(...this.postOrder, 5000) + 1;
    this.nextCommentId = 20000;
  }

  // ---------- Posts ----------

  listPosts(type?: BoardType): PostResponseDto[] {
    const filtered = type
      ? this.postOrder
          .map((id) => this.posts.get(id)!)
          .filter((r) => r.list.boardDesc === BOARD_META[type as BoardKind].desc)
      : this.postOrder.map((id) => this.posts.get(id)!);
    return filtered
      .map((r) => ({ ...r.list }))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  listNotices(): PostResponseDto[] {
    return this.listPosts("NOTICE" as BoardType);
  }

  listPopular(): PostResponseDto[] {
    return this.postOrder
      .map((id) => this.posts.get(id)!.list)
      .map((p) => ({ ...p }))
      .sort((a, b) => b.likeCount - a.likeCount);
  }

  searchPosts(
    boardCode: number,
    keyword: string,
    target: "title" | "title_content"
  ): PostResponseDto[] {
    const entry = (Object.entries(BOARD_META) as [BoardKind, { code: number; desc: string }][]).find(
      ([, meta]) => meta.code === boardCode
    );
    const desc = entry ? entry[1].desc : null;
    const kw = keyword.trim().toLowerCase();
    return this.postOrder
      .map((id) => this.posts.get(id)!)
      .filter((r) => (desc == null ? true : r.list.boardDesc === desc))
      .filter((r) => {
        if (!kw) return true;
        const title = r.list.title.toLowerCase();
        if (title.includes(kw)) return true;
        if (target === "title_content") {
          return r.info.content.toLowerCase().includes(kw);
        }
        return false;
      })
      .map((r) => ({ ...r.list }));
  }

  getPost(id: number): PostInfoResponseDto | null {
    const record = this.posts.get(id);
    if (!record) return null;
    record.list.viewCount += 1;
    record.info.viewCount = record.list.viewCount;
    return { ...record.info, comments: cloneComments(record.info.comments) };
  }

  createPost(payload: PostCreateRequestDto): number {
    const id = this.nextPostId++;
    const meta = BOARD_META[payload.boardType as BoardKind];
    const now = new Date().toISOString().slice(0, 19);
    const listDto: PostResponseDto = {
      postId: id,
      title: payload.title,
      authorName: "데모유저",
      viewCount: 0,
      boardDesc: meta?.desc ?? "자유게시판",
      likeCount: 0,
      dislikeCount: 0,
      createdAt: now,
      commentCnt: 0,
      hasImg: (payload.images?.length ?? 0) > 0,
    };
    const infoDto: PostInfoResponseDto = {
      ...listDto,
      content: payload.content,
      myVote: null,
      images: payload.images ?? [],
      comments: [],
    };
    this.posts.set(id, { list: listDto, info: infoDto, password: payload.password });
    this.postOrder.unshift(id);
    return id;
  }

  updatePost(id: number, payload: PostUpdateRequestDto): number | "not_found" | "bad_password" {
    const record = this.posts.get(id);
    if (!record) return "not_found";
    if (record.password !== payload.password) return "bad_password";
    record.list.title = payload.title;
    record.info.title = payload.title;
    record.info.content = payload.content;
    record.info.images = payload.images ?? record.info.images;
    record.list.hasImg = (record.info.images?.length ?? 0) > 0;
    return id;
  }

  deletePost(id: number, password: string): "ok" | "not_found" | "bad_password" {
    const record = this.posts.get(id);
    if (!record) return "not_found";
    if (record.password !== password) return "bad_password";
    this.posts.delete(id);
    this.postOrder = this.postOrder.filter((pid) => pid !== id);
    return "ok";
  }

  verifyPassword(id: number, password: string): {
    valid: boolean;
    message: string;
    resultCode: string;
  } {
    const record = this.posts.get(id);
    if (!record) return { valid: false, message: "게시글을 찾을 수 없습니다.", resultCode: "NOT_FOUND" };
    if (record.password !== password) {
      return { valid: false, message: "비밀번호가 일치하지 않습니다.", resultCode: "INVALID" };
    }
    return { valid: true, message: "확인되었습니다.", resultCode: "OK" };
  }

  vote(
    clientId: string,
    postId: number,
    voteType: "LIKE" | "DISLIKE"
  ): "liked" | "disliked" | "cancelled" | "not_found" {
    const record = this.posts.get(postId);
    if (!record) return "not_found";
    const key = `${clientId}:${postId}`;
    const existing = this.votes.get(key);
    // cancel path: same vote toggles off
    if (existing?.type === voteType) {
      this.votes.delete(key);
      if (voteType === "LIKE") record.list.likeCount = Math.max(0, record.list.likeCount - 1);
      else record.list.dislikeCount = Math.max(0, record.list.dislikeCount - 1);
      record.info.likeCount = record.list.likeCount;
      record.info.dislikeCount = record.list.dislikeCount;
      record.info.myVote = null;
      return "cancelled";
    }
    // switching vote
    if (existing) {
      if (existing.type === "LIKE") record.list.likeCount = Math.max(0, record.list.likeCount - 1);
      else record.list.dislikeCount = Math.max(0, record.list.dislikeCount - 1);
    }
    this.votes.set(key, { postId, type: voteType });
    if (voteType === "LIKE") record.list.likeCount += 1;
    else record.list.dislikeCount += 1;
    record.info.likeCount = record.list.likeCount;
    record.info.dislikeCount = record.list.dislikeCount;
    record.info.myVote = voteType;
    return voteType === "LIKE" ? "liked" : "disliked";
  }

  // ---------- Comments ----------

  addComment(
    postId: number,
    content: string,
    authorName: string | null,
    password: string | undefined,
    parentId: number | null | undefined
  ): { ok: boolean } {
    const record = this.posts.get(postId);
    if (!record) return { ok: false };
    const now = new Date().toISOString().slice(0, 19);
    const newComment: CommentResponseDto = {
      commentId: this.nextCommentId++,
      content,
      authorName: authorName?.trim() || "익명",
      createdAt: now,
      isUpdated: false,
      parentId: parentId ?? null,
      children: [],
    };
    // Attach password at parent record via parallel map (simplified: ignore)
    void password;
    if (parentId == null) {
      record.info.comments.push(newComment);
    } else {
      const parent = findComment(record.info.comments, parentId);
      if (parent) {
        parent.children = parent.children ?? [];
        parent.children.push(newComment);
      } else {
        record.info.comments.push(newComment);
      }
    }
    record.list.commentCnt = countComments(record.info.comments);
    return { ok: true };
  }

  updateComment(
    commentId: number,
    content: string
  ): "ok" | "not_found" {
    for (const record of this.posts.values()) {
      const c = findComment(record.info.comments, commentId);
      if (c) {
        c.content = content;
        c.isUpdated = true;
        return "ok";
      }
    }
    return "not_found";
  }

  deleteComment(commentId: number): "ok" | "not_found" {
    for (const record of this.posts.values()) {
      const removed = removeComment(record.info.comments, commentId);
      if (removed) {
        record.list.commentCnt = countComments(record.info.comments);
        return "ok";
      }
    }
    return "not_found";
  }

  // ---------- Clan / Player refresh ----------

  touchClan(clanId: number): string {
    const stamp = new Date().toISOString().slice(0, 19);
    this.clanRefreshedAt.set(clanId, stamp);
    const clan = this.clans.find((c) => c.clanId === clanId);
    if (clan) clan.updateAt = stamp;
    return stamp;
  }

  touchPlayer(playerId: number): string {
    const stamp = new Date().toISOString().slice(0, 19);
    this.playerRefreshedAt.set(playerId, stamp);
    return stamp;
  }
}

function cloneComments(comments: CommentResponseDto[]): CommentResponseDto[] {
  return comments.map((c) => ({
    ...c,
    children: c.children ? cloneComments(c.children) : undefined,
  }));
}

function findComment(
  comments: CommentResponseDto[],
  commentId: number
): CommentResponseDto | null {
  for (const c of comments) {
    if (c.commentId === commentId) return c;
    const found = c.children ? findComment(c.children, commentId) : null;
    if (found) return found;
  }
  return null;
}

function removeComment(
  comments: CommentResponseDto[],
  commentId: number
): boolean {
  for (let i = 0; i < comments.length; i++) {
    if (comments[i].commentId === commentId) {
      comments.splice(i, 1);
      return true;
    }
    if (comments[i].children && removeComment(comments[i].children!, commentId)) {
      return true;
    }
  }
  return false;
}

function countComments(comments: CommentResponseDto[]): number {
  let n = 0;
  for (const c of comments) {
    n += 1;
    if (c.children) n += countComments(c.children);
  }
  return n;
}

declare global {
  var __saFieldDemoStore__: DemoStore | undefined;
}

export function getStore(): DemoStore {
  if (!globalThis.__saFieldDemoStore__) {
    globalThis.__saFieldDemoStore__ = new DemoStore();
  }
  return globalThis.__saFieldDemoStore__;
}

export type { DemoStore, ImageDto };
