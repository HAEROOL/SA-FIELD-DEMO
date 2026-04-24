/**
 * 통계 계산 관련 유틸리티 함수
 */

/** 휴면 계정을 나타내는 래더 점수 sentinel 값 */
export const DORMANT_LADDER_POINT = -999;

/** 휴면 계정 래더 점수 마스킹 표시 문자열 (추후 변경 가능) */
export const DORMANT_LADDER_MASK = "-";

/**
 * 승률 계산
 * @param wins 승수
 * @param losses 패수
 * @returns 승률 (0-100)
 */
export function calculateWinRate(wins: number, losses: number): number {
  const totalMatches = wins + losses;
  if (totalMatches === 0) return 0;
  return (wins / totalMatches) * 100;
}

/**
 * KD 비율 계산 (Sudden Attack 방식: K / (K + D))
 * @param kills 킬수
 * @param deaths 데스수
 * @returns KD 비율 (0-100)
 */
export function calculateKDAPercent(kills: number, deaths: number): number {
  const total = kills + deaths;
  if (total === 0) return 0;
  return (kills / total) * 100;
}

/**
 * KDA ratio 계산 ((K + A) / D)
 * @param kills 킬수
 * @param deaths 데스수
 * @returns KDA ratio
 */
export function calculateKDA(kills: number, deaths: number, _assists: number): number {
  const total = kills + deaths;
  if (total === 0) return 0;
  return (kills / total) * 100;
}

/**
 * 평균 킬수 계산
 * @param totalKills 총 킬수
 * @param totalGames 총 게임수
 * @returns 평균 킬수
 */
export function calculateAvgKills(totalKills: number, totalGames: number): number {
  if (totalGames === 0) return 0;
  return totalKills / totalGames;
}

/**
 * 승률에 따른 색상 클래스 반환
 * @param winRate 승률 (0-100)
 * @returns Tailwind 색상 클래스
 */
export function getWinRateColorClass(winRate: number): string {
  if (winRate >= 70) return "text-brand-lose";
  if (winRate >= 60) return "text-orange-500";
  if (winRate >= 50) return "text-brand-win";
  return "text-gray-500";
}

/**
 * KDA/킬뎃 점수에 따른 색상 클래스 반환
 * @param kda 킬뎃 (0-100)
 * @returns Tailwind 색상 클래스
 */
export function getKdaColorClass(kda: number): string {
  if (kda >= 70) return "text-brand-lose";
  if (kda >= 65) return "text-yellow-500";
  if (kda >= 60) return "text-orange-500";
  if (kda >= 55) return "text-sky-400";
  if (kda >= 50) return "text-green-500";
  return "text-gray-500";
}

/**
 * 래더 점수에 따른 색상 클래스 반환
 * @param ladderPoints 래더 점수
 * @returns Tailwind 색상 클래스
 */
export function getLadderPointColorClass(ladderPoints: number): string {
  if (ladderPoints === DORMANT_LADDER_POINT) return "text-gray-500";
  if (ladderPoints >= 2500) return "text-brand-lose";
  if (ladderPoints >= 2000) return "text-orange-500";
  if (ladderPoints >= 1800) return "text-blue-500";
  if (ladderPoints > 1500) return "text-green-500";
  return "text-gray-500";
}

/**
 * 래더 점수를 표시용 문자열로 변환 (휴면 계정은 마스킹 처리)
 * @param points 래더 점수
 * @returns 표시용 문자열 (정상 점수는 "점" 접미사 포함, 휴면 계정은 "-" 반환)
 */
export function formatLadderPoint(points: number): string {
  if (points === DORMANT_LADDER_POINT) return DORMANT_LADDER_MASK;
  return `${points.toLocaleString()}점`;
}

/**
 * 숫자를 포맷팅 (소수점 자리수 지정)
 * @param value 숫자
 * @param decimals 소수점 자리수 (기본값: 1)
 * @returns 포맷된 문자열
 */
export function formatNumber(value: number, decimals: number = 1): string {
  return value.toFixed(decimals);
}

/**
 * 안전한 나눗셈 (0으로 나누기 방지)
 * @param numerator 분자
 * @param denominator 분모
 * @param defaultValue 분모가 0일 때 반환할 기본값
 * @returns 계산 결과
 */
export function safeDivide(
  numerator: number,
  denominator: number,
  defaultValue: number = 0
): number {
  if (denominator === 0) return defaultValue;
  return numerator / denominator;
}
