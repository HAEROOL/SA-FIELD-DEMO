"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import Image from "next/image";
import NavSearch from "./NavSearch";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "홈" },
    { href: "/league", label: "리그" },
    { href: "/ranking", label: "랭킹" },
    { href: "/board", label: "커뮤니티" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#363944] shadow-md">
      {/* Row 1: Logo & Actions (Full Width) */}
      <div className="relative z-20 w-full h-14 border-b border-gray-700/50 px-4 md:px-6 lg:px-4 xl:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-30 h-12 -ms-2">
            <Image
              src="/images/main_logo.svg"
              alt="SA.FIELD Logo"
              fill
              sizes="120px"
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <NavSearch />
            <button className="text-gray-400 hover:text-white transition-colors">
              {/* <i className="fas fa-user"></i> */}
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Navigation Links (Horizontal Scroll on Mobile, Aligned on Desktop) */}
      <div className="flex justify-start md:justify-center w-full bg-[#2d3038]/95 md:bg-[#2d3038]/80 backdrop-blur-sm border-b border-gray-700/50 overflow-x-auto scrollbar-hide">
        <div className="w-full md:max-w-[1920px] flex md:justify-center gap-4 lg:gap-2 xl:gap-6 px-4 md:px-6 lg:px-4 xl:px-8">
          {/* Left Spacer (Desktop Only) */}
          <div className="hidden lg:block w-[180px] min-[1740px]:w-[300px] shrink-0" />

          {/* Nav Content */}
          <div className="flex-1 max-w-5xl h-12 flex items-center min-w-0">
            <div className="flex items-center space-x-1 w-full overflow-x-auto scrollbar-hide whitespace-nowrap -mx-4 px-4 md:mx-0 md:px-0">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={clsx(
                      "px-4 py-2 rounded-md text-sm font-bold transition-all duration-200 shrink-0",
                      isActive
                        ? "text-white bg-gray-700/50"
                        : "text-gray-300 hover:text-white hover:bg-gray-700/30",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Spacer (Desktop Only) */}
          <div className="hidden lg:block w-[180px] min-[1740px]:w-[300px] shrink-0" />
        </div>
      </div>
    </nav>
  );
}
