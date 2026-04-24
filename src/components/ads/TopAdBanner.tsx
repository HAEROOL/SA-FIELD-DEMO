import React from "react";

export default function TopAdBanner() {
  return (
    <div className="mx-auto bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm transition-all duration-300 w-[336px] h-[280px] md:w-full md:max-w-[728px] md:h-[97px] min-[1740px]:max-w-[970px] min-[1740px]:h-[250px] mb-8 flex flex-col items-center justify-center text-gray-400 text-sm p-4 text-center">
      <i className="fas fa-ad text-3xl mb-2"></i>
      <span>
        Advertisement
        <br />
        (Top Banner)
      </span>
    </div>
  );
}
