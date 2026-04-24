import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1e2026] border-t border-gray-800 py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
        <div className="mb-6 opacity-60 hover:opacity-100 transition-opacity relative w-[140px] h-10">
          <Image
            src="/images/main_logo.svg"
            alt="SA.FIELD Logo"
            fill
            sizes="140px"
            className="object-contain"
          />
        </div>
        <p className="text-gray-400 text-sm mb-2 max-w-md">
          sa.field는 서든어택의 공식 웹사이트가 아니며, 유저 주도의 사설 리그
          플랫폼입니다.
        </p>
        <p className="text-gray-500 text-xs mb-3">
          문의:{" "}
          <a href="mailto:safield.official@gmail.com" className="hover:text-gray-300 transition-colors">
            safield.official@gmail.com
          </a>
        </p>
        <div className="flex gap-4 mb-3">
          <Link href="/terms" className="text-gray-500 text-xs hover:text-gray-300 transition-colors">
            이용약관
          </Link>
          <Link href="/privacy" className="text-gray-500 text-xs hover:text-gray-300 transition-colors">
            개인정보처리방침
          </Link>
        </div>
        <p className="text-gray-500 text-xs">
          &copy; 2025 sa.field. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
