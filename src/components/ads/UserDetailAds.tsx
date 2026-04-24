import React from "react";

export default function UserDetailAds() {
  const adBoxClasses = "bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 text-sm p-4 text-center shadow-sm transition-all duration-300";

  return (
    <div className="w-full">
      {/* Desktop View: Stacked 2 x 90px ads (lg and above) */}
      <div className="hidden lg:flex flex-col gap-4">
        <div className={`w-full h-[90px] ${adBoxClasses}`}>
          <i className="fas fa-ad text-xl mb-1"></i>
          <span className="text-[10px]">Advertisement</span>
        </div>
        <div className={`w-full h-[90px] ${adBoxClasses}`}>
          <i className="fas fa-ad text-xl mb-1"></i>
          <span className="text-[10px]">Advertisement</span>
        </div>
      </div>

      {/* Tablet & Mobile View: Single 280px ad (below lg) */}
      <div className="lg:hidden flex justify-center">
        <div className={`w-full h-[280px] ${adBoxClasses}`}>
          <i className="fas fa-ad text-3xl mb-2"></i>
          <span>Advertisement</span>
        </div>
      </div>
    </div>
  );
}
