import privacyData from "@/data/privacy.json";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-black text-black mb-2">{privacyData.title}</h1>
        <p className="text-gray-500 text-xs mb-6">최종 업데이트: {privacyData.lastUpdated}</p>
        <p className="text-black text-sm whitespace-pre-line leading-relaxed mb-10">
          {privacyData.intro}
        </p>
        <div className="space-y-8">
          {privacyData.sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-base font-bold text-black mb-2">{section.title}</h2>
              <p className="text-black text-sm whitespace-pre-line leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
