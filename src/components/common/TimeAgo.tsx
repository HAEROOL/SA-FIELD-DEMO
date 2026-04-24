"use client";

import { useMounted } from "@/hooks/useMounted";

interface TimeAgoProps {
  date: string | Date;
  format?: "ago" | "detail" | "time";
  className?: string;
}

export default function TimeAgo({ date: _date, format = "ago", className }: TimeAgoProps) {
  const isMounted = useMounted();

  if (!isMounted) {
    return <span className={className}>&nbsp;</span>; // 서버 사이드에서는 placeholder 렌더링
  }

  const date = new Date(_date || new Date());

  const getFormattedDate = () => {
    if (format === "ago") {
        const today = new Date();
        const isToday =
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear();
    
        if (isToday) {
          const now = new Date();
          const diffMs = now.getTime() - date.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMins / 60);
    
          if (diffMins < 60) {
            return `${diffMins}분 전`;
          } else if (diffHours < 24) {
            return `${diffHours}시간 전`;
          }
        }
        return `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
    }

    if (format === "detail") {
        return date.toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
    }

    if (format === "time") {
        return date.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
    }
    
    return "";
  };


  return <span className={className}>{getFormattedDate()}</span>;
}
