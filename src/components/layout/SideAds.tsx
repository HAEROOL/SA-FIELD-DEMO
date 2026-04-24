export function LeftAd() {
  return (
    <aside className="hidden min-[1080px]:block w-[180px] min-[1740px]:w-[300px] shrink-0 sticky top-24 h-[600px]">
      <div className="w-full h-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded flex flex-col items-center justify-center text-gray-400 text-sm p-4 text-center">
        <i className="fas fa-ad text-3xl mb-2"></i>
        <span>
          Advertisement
          <br />
          (Left Wing)
        </span>
      </div>
    </aside>
  );
}

export function RightAd() {
  return (
    <aside className="hidden min-[1080px]:block w-[180px] min-[1740px]:w-[300px] shrink-0 sticky top-24 h-[600px]">
      <div className="w-full h-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded flex flex-col items-center justify-center text-gray-400 text-sm p-4 text-center">
        <i className="fas fa-ad text-3xl mb-2"></i>
        <span>
          Advertisement
          <br />
          (Right Wing)
        </span>
      </div>
    </aside>
  );
}

export function BottomAd() {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-8">
      <div className="w-full h-24 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded flex items-center justify-center text-gray-400 text-sm p-4 text-center shadow-sm transition-all duration-300">
        <i className="fas fa-ad text-2xl mr-3"></i>
        <span>Bottom Banner Advertisement Area</span>
      </div>
    </div>
  );
}
