"use client";

import { useState } from "react";
import Image from "next/image";
import { getProxiedImageUrl } from "@/utils/image";

interface ClanLogoProps {
  clanName: string;
  clanMarkUrl: string | null | undefined;
  clanBackMarkUrl: string | null | undefined;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ClanLogo({
  clanName,
  clanMarkUrl,
  clanBackMarkUrl,
  size = "md",
  className = "",
}: ClanLogoProps) {
  const [isError, setIsError] = useState(false);

  // URL이 변경되면 에러 상태 초기화
  const [prevUrls, setPrevUrls] = useState({ mark: clanMarkUrl, back: clanBackMarkUrl });
  if (prevUrls.mark !== clanMarkUrl || prevUrls.back !== clanBackMarkUrl) {
    setPrevUrls({ mark: clanMarkUrl, back: clanBackMarkUrl });
    setIsError(false);
  }

  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const sizeClass = sizeClasses[size];

  // Check for invalid URLs (null, undefined, empty string, "null")
  const isValidUrl = (url: string | null | undefined) => 
    url && url !== "" && url !== "null" && url !== "undefined";

  const hasMark = isValidUrl(clanMarkUrl);
  const hasBackMark = isValidUrl(clanBackMarkUrl);

  // 둘 다 없거나, 이미지 로드 에러가 발생하면 fallback 표시
  if ((!hasMark && !hasBackMark) || isError) {
    return (
      <div
        className={`${sizeClass} shrink-0 rounded-md relative overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}
      >
        <Image
          src="/images/clan-fallback.png"
          alt="기본 클랜 로고"
          fill
          className="object-contain p-1"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div className={`${sizeClass} shrink-0 relative rounded-md overflow-hidden ${className}`}>
      {/* 배경 이미지 */}
      {clanBackMarkUrl && (
        <Image
          src={getProxiedImageUrl(clanBackMarkUrl)}
          alt={`${clanName} 배경`}
          fill
          className="object-contain"
          unoptimized
          onError={() => setIsError(true)}
        />
      )}
      {/* 전경 이미지 */}
      {clanMarkUrl && (
        <Image
          src={getProxiedImageUrl(clanMarkUrl)}
          alt={`${clanName} 로고`}
          fill
          className="object-contain absolute inset-0"
          unoptimized
          onError={() => setIsError(true)}
        />
      )}
    </div>
  );
}
