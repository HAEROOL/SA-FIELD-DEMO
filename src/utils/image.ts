/**
 * 이미지 URL을 API 서버 주소를 바라보도록 변환하는 유틸리티
 * 상대 경로(/uploads/...)인 경우 NEXT_PUBLIC_API_URL 또는 기본 API 주소를 붙여줍니다.
 */
export function getProxiedImageUrl(url: string | null | undefined): string {
  if (!url) return "";

  // 이미 전체 URL인 경우 (http:// 또는 https:// 로 시작)
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // 데이터 URL인 경우 (data:image/...)
  if (url.startsWith("data:")) {
    return url;
  }

  // 상대 경로인 경우 API 서버 주소를 붙임
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.safield.kr/api/";
  
  // API 주소에서 마지막 /api/ 부분을 떼어내고 이미지 경로를 붙여야 할 수도 있음
  // 서버 설정에 따라 다르지만 보통 /uploads/... 식의 경로라면 도메인 바로 뒤에 붙어야 함
  // NEXT_PUBLIC_API_URL이 https://api.safield.kr/api/ 라면 도메인만 추출
  try {
    const urlObj = new URL(apiBaseUrl);
    const origin = urlObj.origin;
    
    // URL이 /로 시작하지 않으면 /를 붙여줌
    const path = url.startsWith("/") ? url : `/${url}`;
    return `${origin}${path}`;
  } catch (e) {
    // URL 파싱 실패 시 기본값 처리
    const origin = "https://api.safield.kr";
    const path = url.startsWith("/") ? url : `/${url}`;
    return `${origin}${path}`;
  }
}
