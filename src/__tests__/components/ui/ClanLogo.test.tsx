import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ClanLogo } from "@/components/ui/ClanLogo";

describe("ClanLogo 컴포넌트", () => {
  it("두 이미지 URL이 모두 제공되면 두 개의 Image가 렌더링되어야 한다", () => {
    const { container } = render(
      <ClanLogo
        clanName="Ultron"
        clanMarkUrl="51/1_24_397.png"
        clanBackMarkUrl="51/1_24_397_back.png"
      />
    );

    const images = container.querySelectorAll("img");
    expect(images.length).toBe(2); // 배경 + 전경
  });

  it("clanBackMarkUrl만 있을 때 하나의 Image만 표시되어야 한다", () => {
    const { container } = render(
      <ClanLogo
        clanName="Ultron"
        clanMarkUrl={null}
        clanBackMarkUrl="51/1_24_397_back.png"
      />
    );

    const images = container.querySelectorAll("img");
    expect(images.length).toBe(1);
  });

  it("clanMarkUrl만 있을 때 하나의 Image만 표시되어야 한다", () => {
    const { container } = render(
      <ClanLogo
        clanName="Ultron"
        clanMarkUrl="51/1_24_397.png"
        clanBackMarkUrl={null}
      />
    );

    const images = container.querySelectorAll("img");
    expect(images.length).toBe(1);
  });

  it("둘 다 없을 때 fallback (클랜명 첫 글자)을 표시해야 한다", () => {
    render(
      <ClanLogo
        clanName="Ultron"
        clanMarkUrl={null}
        clanBackMarkUrl={null}
      />
    );

    expect(screen.getByAltText("기본 클랜 로고")).toBeInTheDocument();
    const images = document.querySelectorAll("img");
    expect(images.length).toBe(1);
  });

  it("이미지 URL이 없을 때 fallback을 표시해야 한다", () => {
    render(
      <ClanLogo
        clanName="Ultron"
        clanMarkUrl={null}
        clanBackMarkUrl={null}
      />
    );

    expect(screen.getByAltText("기본 클랜 로고")).toBeInTheDocument();
    const images = document.querySelectorAll("img");
    expect(images.length).toBe(1);
  });

  it("size prop에 따라 크기가 변경되어야 한다", () => {
    const { container, rerender } = render(
      <ClanLogo
        clanName="Ultron"
        clanMarkUrl="51/1_24_397.png"
        clanBackMarkUrl="51/1_24_397_back.png"
        size="sm"
      />
    );

    let wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("w-6", "h-6");

    rerender(
      <ClanLogo
        clanName="Ultron"
        clanMarkUrl="51/1_24_397.png"
        clanBackMarkUrl="51/1_24_397_back.png"
        size="md"
      />
    );

    wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("w-8", "h-8");

    rerender(
      <ClanLogo
        clanName="Ultron"
        clanMarkUrl="51/1_24_397.png"
        clanBackMarkUrl="51/1_24_397_back.png"
        size="lg"
      />
    );

    wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("w-12", "h-12");
  });

  it("커스텀 className이 적용되어야 한다", () => {
    const { container } = render(
      <ClanLogo
        clanName="Ultron"
        clanMarkUrl="51/1_24_397.png"
        clanBackMarkUrl="51/1_24_397_back.png"
        className="custom-class"
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("custom-class");
  });

  it("이미지 alt 속성이 올바르게 설정되어야 한다", () => {
    render(
      <ClanLogo
        clanName="Ultron"
        clanMarkUrl="51/1_24_397.png"
        clanBackMarkUrl="51/1_24_397_back.png"
      />
    );

    expect(screen.getByAltText("Ultron 배경")).toBeInTheDocument();
    expect(screen.getByAltText("Ultron 로고")).toBeInTheDocument();
  });
  it("배경 이미지가 로드 실패하면 fallback을 표시해야 한다", async () => {
    const { container } = render(
      <ClanLogo
        clanName="Ultron"
        clanMarkUrl="51/1_24_397.png"
        clanBackMarkUrl="51/1_24_397_back.png"
      />
    );

    const images = container.querySelectorAll("img");
    expect(images.length).toBe(2);

    // 배경 이미지 에러 트리거 (첫 번째 이미지가 배경)
    const bgImg = images[0];
    bgImg.dispatchEvent(new Event("error"));

    await expect(screen.findByAltText("기본 클랜 로고")).resolves.toBeInTheDocument();
  });

  it("전경 이미지가 로드 실패하면 fallback을 표시해야 한다", async () => {
    const { container } = render(
      <ClanLogo
        clanName="Ultron"
        clanMarkUrl="51/1_24_397.png"
        clanBackMarkUrl="51/1_24_397_back.png"
      />
    );

    const images = container.querySelectorAll("img");
    expect(images.length).toBe(2);

    // 전경 이미지 에러 트리거 (두 번째 이미지가 전경)
    const fgImg = images[1];
    fgImg.dispatchEvent(new Event("error"));

    await expect(screen.findByAltText("기본 클랜 로고")).resolves.toBeInTheDocument();
  });
});
