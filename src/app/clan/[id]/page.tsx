import ClanHeader from "@/components/clan/ClanHeader";
import ClanSeasonStats from "@/components/clan/ClanSeasonStats";
import ClanRecentGames from "@/components/clan/ClanRecentGames";
import ClanContent from "@/components/clan/ClanContent";
import { clanService } from "@/apis/clanService";
import MainLayout from "@/components/layout/MainLayout";
import TopAdBanner from "@/components/ads/TopAdBanner";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClanPage({ params }: PageProps) {
  const { id } = await params;
  const clanId = parseInt(id, 10);

  // Fetch clan info on server
  let clanInfo = undefined;
  try {
    clanInfo = await clanService.getClanInfo(id);
  } catch (error) {
    console.error("Failed to fetch clan info:", error);
  }

  return (
    <MainLayout>
      <div className="flex flex-col w-full">
        {/* Mobile Ad Banner */}
        <div className="md:hidden flex justify-center mb-6">
          <TopAdBanner />
        </div>

        {/* Top Section: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mb-6">
          {/* Left Column: Header + Recent Games (70%) - Mobile: contents (unwrap) */}
          <div className="contents md:block md:col-span-7 md:order-1 md:space-y-6">
            {/* Header - Mobile Order: 1 */}
            <div className="order-1">
               <ClanHeader clanInfo={clanInfo} />
            </div>
            {/* Recent Games - Mobile Order: 3 */}
            <div className="order-3 mt-6 md:mt-0">
              <ClanRecentGames clanId={clanId} />
            </div>
          </div>

          {/* Right Column: Season Stats (30%) - Mobile Order: 2 */}
          <div className="order-2 md:col-span-3 md:order-2 h-fit">
            <ClanSeasonStats clanInfo={clanInfo} />
          </div>
        </div>

        {/* Bottom Section: Records/Content (Full Width) */}
        <div className="w-full">
          <ClanContent clanId={clanId} clanInfo={clanInfo} />
        </div>
      </div>
    </MainLayout>
  );
}
