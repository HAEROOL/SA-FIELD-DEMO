import termsData from "@/data/terms.json";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-black text-black mb-2">{termsData.title}</h1>
        <p className="text-gray-500 text-xs mb-10">최종 업데이트: {termsData.lastUpdated}</p>
        <div className="space-y-8">
          {termsData.sections.map((section) => (
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
