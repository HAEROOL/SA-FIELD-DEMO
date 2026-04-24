import { describe, it, expect, vi } from "vitest";
import { getProxiedImageUrl } from "../../utils/image";

describe("getProxiedImageUrl", () => {
  it("should return the same URL if it is already absolute (https)", () => {
    const url = "https://example.com/image.png";
    expect(getProxiedImageUrl(url)).toBe(url);
  });

  it("should return the same URL if it is already absolute (http)", () => {
    const url = "http://example.com/image.png";
    expect(getProxiedImageUrl(url)).toBe(url);
  });

  it("should return the same URL if it is a data URL", () => {
    const url = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    expect(getProxiedImageUrl(url)).toBe(url);
  });

  it("should prepend the API domain to a relative path starting with /", () => {
    const url = "/uploads/test.png";
    // 기본값인 https://api.safield.kr 가 붙어야 함
    expect(getProxiedImageUrl(url)).toBe("https://api.safield.kr/uploads/test.png");
  });

  it("should prepend the API domain to a relative path NOT starting with /", () => {
    const url = "uploads/test.png";
    expect(getProxiedImageUrl(url)).toBe("https://api.safield.kr/uploads/test.png");
  });

  it("should return an empty string if url is null or undefined", () => {
    expect(getProxiedImageUrl(null)).toBe("");
    expect(getProxiedImageUrl(undefined)).toBe("");
  });
});
