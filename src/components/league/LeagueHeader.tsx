"use client";

export default function LeagueHeader() {
  return (
    <div className="mb-0">
      <div className="bg-[#2d3038] p-6 text-white relative overflow-hidden border border-gray-700 shadow-sm flex flex-col justify-center h-[120px]">
        <h1 className="text-3xl font-black mb-1 relative z-10 flex items-center gap-3">
          <i className="fas fa-trophy text-yellow-400"></i> OFFICIAL LEAGUE
        </h1>
        <p className="text-gray-400 text-sm relative z-10 ml-1">
          Pre Season 진행 중
        </p>
      </div>
    </div>
  );
}

