interface UserTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function UserTabs({ activeTab, onTabChange }: UserTabsProps) {
  const tabs = [
    { id: "history", label: "히스토리", icon: "fa-history" },
    { id: "stats", label: "통계실", icon: "fa-chart-pie" },
  ];

  return (
    <div className="relative mb-6">
      <div className="flex space-x-1 overflow-x-auto scrollbar-hide relative z-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-8 py-3 text-sm font-bold flex items-center gap-2 transition-all duration-200 whitespace-nowrap rounded-none border-b-4 ${
              activeTab === tab.id
                ? "bg-[#2d3038] text-white border-brand-500"
                : "bg-gray-400 dark:bg-gray-600 text-white border-[#2d3038] hover:bg-gray-500"
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            <i className={`fas ${tab.icon} ${activeTab === tab.id ? "text-brand-500" : "opacity-70"}`}></i> {tab.label}
          </button>
        ))}
      </div>
      {/* Full-width dark bar behind tabs */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2d3038] z-0"></div>
    </div>
  );
}
