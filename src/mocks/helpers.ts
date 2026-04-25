import type { PaginatedResponse } from "@/apis/types/user.type";
import type {
  PagePostResponseDto,
  PostResponseDto,
} from "@/apis/types/post.type";

export function paginate<T>(items: T[], page: number, size: number): T[] {
  const start = page * size;
  return items.slice(start, start + size);
}

export function toSpringPage<T>(
  items: T[],
  page: number,
  size: number
): PaginatedResponse<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / size));
  const content = paginate(items, page, size);
  return {
    totalPages,
    totalElements: total,
    last: page >= totalPages - 1,
    first: page === 0,
    numberOfElements: content.length,
    size,
    number: page,
    empty: content.length === 0,
    content,
    pageable: {
      pageNumber: page,
      pageSize: size,
      paged: true,
      unpaged: false,
      offset: page * size,
      sort: { sorted: true, unsorted: false, empty: false },
    },
    sort: { sorted: true, unsorted: false, empty: false },
  };
}

export function toPostPage(
  items: PostResponseDto[],
  page: number,
  size: number
): PagePostResponseDto {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / size));
  const content = paginate(items, page, size);
  return {
    totalPages,
    totalElements: total,
    pageable: {
      pageNumber: page,
      pageSize: size,
      paged: true,
      unpaged: false,
      offset: page * size,
      sort: { sorted: true, unsorted: false, empty: false },
    },
    numberOfElements: content.length,
    size,
    content,
    number: page,
    sort: { sorted: true, unsorted: false, empty: false },
    first: page === 0,
    last: page >= totalPages - 1,
    empty: content.length === 0,
  };
}

export function parseInt0(value: string | null, fallback = 0): number {
  if (value == null) return fallback;
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

export function jsonResponse<T>(data: T, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...(init?.headers ?? {}),
    },
  });
}

export function sseStream(
  run: (emit: (event: string, data: string) => void) => Promise<void>
): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event: string, data: string) => {
        const chunk = `event: ${event}\ndata: ${data}\n\n`;
        controller.enqueue(encoder.encode(chunk));
      };
      try {
        await run(emit);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "unknown";
        const chunk = `event: error\ndata: ${msg}\n\n`;
        controller.enqueue(encoder.encode(chunk));
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
