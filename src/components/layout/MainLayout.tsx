import type { ReactNode } from "react";
import { LeftAd, RightAd } from "./SideAds";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex justify-center w-full grow relative px-4 md:px-6 lg:px-4 xl:px-8 py-8 gap-6">
      <div className="w-full max-w-[1920px] flex justify-center gap-4 lg:gap-2 xl:gap-6">
        <LeftAd />
        <main className="flex-1 max-w-5xl w-full flex flex-col gap-6 min-w-0">
          {children}
        </main>
        <RightAd />
      </div>
    </div>
  );
}
