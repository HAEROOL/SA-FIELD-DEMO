export function getRelativeTime(dateString?: string | Date | null): string {
  if (!dateString) return "날짜 없음";
  const date = new Date(dateString);
  
  // Invalid date check
  if (isNaN(date.getTime())) return "날짜 없음";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  if (diffMs < 0) return "방금 전";

  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) {
    return diffMins === 0 ? "방금 전" : `${diffMins}분 전`;
  }

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, "0")}. ${String(date.getDate()).padStart(2, "0")}`;
}
