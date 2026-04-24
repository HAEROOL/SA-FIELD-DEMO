import { describe, it, expect } from "vitest";
import {
  calculateWinRate,
  calculateKDAPercent,
  calculateAvgKills,
  getWinRateColorClass,
  formatNumber,
  safeDivide,
} from "@/utils/stats";

describe("stats utilities", () => {
  describe("calculateWinRate", () => {
    it("올바른 승률을 계산해야 함", () => {
      expect(calculateWinRate(7, 3)).toBe(70);
      expect(calculateWinRate(5, 5)).toBe(50);
      expect(calculateWinRate(3, 7)).toBe(30);
    });

    it("게임이 없을 때 0을 반환해야 함", () => {
      expect(calculateWinRate(0, 0)).toBe(0);
    });

    it("승리만 있을 때 100을 반환해야 함", () => {
      expect(calculateWinRate(10, 0)).toBe(100);
    });

    it("패배만 있을 때 0을 반환해야 함", () => {
      expect(calculateWinRate(0, 10)).toBe(0);
    });
  });

  describe("calculateKDAPercent", () => {
    it("올바른 KDA 비율을 계산해야 함", () => {
      expect(calculateKDAPercent(70, 30)).toBe(70);
      expect(calculateKDAPercent(50, 50)).toBe(50);
      expect(calculateKDAPercent(30, 70)).toBe(30);
    });

    it("킬과 데스가 모두 0일 때 0을 반환해야 함", () => {
      expect(calculateKDAPercent(0, 0)).toBe(0);
    });

    it("킬만 있을 때 100을 반환해야 함", () => {
      expect(calculateKDAPercent(100, 0)).toBe(100);
    });

    it("데스만 있을 때 0을 반환해야 함", () => {
      expect(calculateKDAPercent(0, 100)).toBe(0);
    });
  });

  describe("calculateAvgKills", () => {
    it("올바른 평균 킬수를 계산해야 함", () => {
      expect(calculateAvgKills(100, 10)).toBe(10);
      expect(calculateAvgKills(75, 10)).toBe(7.5);
      expect(calculateAvgKills(50, 20)).toBe(2.5);
    });

    it("게임이 0일 때 0을 반환해야 함", () => {
      expect(calculateAvgKills(100, 0)).toBe(0);
    });

    it("킬이 0일 때 0을 반환해야 함", () => {
      expect(calculateAvgKills(0, 10)).toBe(0);
    });
  });

  describe("getWinRateColorClass", () => {
    it("승률이 70% 이상일 때 빨간색을 반환해야 함", () => {
      expect(getWinRateColorClass(70)).toBe("text-red-500 font-bold");
      expect(getWinRateColorClass(80)).toBe("text-red-500 font-bold");
      expect(getWinRateColorClass(100)).toBe("text-red-500 font-bold");
    });

    it("승률이 60-69%일 때 주황색을 반환해야 함", () => {
      expect(getWinRateColorClass(60)).toBe("text-orange-500 font-bold");
      expect(getWinRateColorClass(65)).toBe("text-orange-500 font-bold");
      expect(getWinRateColorClass(69)).toBe("text-orange-500 font-bold");
    });

    it("승률이 50-59%일 때 초록색을 반환해야 함", () => {
      expect(getWinRateColorClass(50)).toBe("text-green-500 font-medium");
      expect(getWinRateColorClass(55)).toBe("text-green-500 font-medium");
      expect(getWinRateColorClass(59)).toBe("text-green-500 font-medium");
    });

    it("승률이 50% 미만일 때 회색을 반환해야 함", () => {
      expect(getWinRateColorClass(49)).toBe("text-gray-500");
      expect(getWinRateColorClass(30)).toBe("text-gray-500");
      expect(getWinRateColorClass(0)).toBe("text-gray-500");
    });
  });

  describe("formatNumber", () => {
    it("기본적으로 소수점 한 자리로 포맷해야 함", () => {
      expect(formatNumber(12.345)).toBe("12.3");
      expect(formatNumber(99.999)).toBe("100.0");
    });

    it("지정된 소수점 자리수로 포맷해야 함", () => {
      expect(formatNumber(12.345, 2)).toBe("12.35");
      expect(formatNumber(12.345, 0)).toBe("12");
    });

    it("정수도 올바르게 포맷해야 함", () => {
      expect(formatNumber(10)).toBe("10.0");
      expect(formatNumber(10, 2)).toBe("10.00");
    });
  });

  describe("safeDivide", () => {
    it("올바른 나눗셈 결과를 반환해야 함", () => {
      expect(safeDivide(10, 2)).toBe(5);
      expect(safeDivide(100, 4)).toBe(25);
      expect(safeDivide(7, 2)).toBe(3.5);
    });

    it("0으로 나누기를 시도할 때 기본값을 반환해야 함", () => {
      expect(safeDivide(10, 0)).toBe(0);
      expect(safeDivide(10, 0, -1)).toBe(-1);
      expect(safeDivide(10, 0, 100)).toBe(100);
    });

    it("분자가 0일 때 0을 반환해야 함", () => {
      expect(safeDivide(0, 10)).toBe(0);
    });
  });
});
