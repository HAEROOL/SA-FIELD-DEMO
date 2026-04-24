import MainLayout from "@/components/layout/MainLayout";
import UserHeader from "@/components/user/UserHeader";
import UserRecord from "@/components/user/UserRecord";
import RecentGames from "@/components/user/RecentGames";
import SeasonStats from "@/components/user/SeasonStats";
import { userService } from "@/apis/userService";
import TopAdBanner from "@/components/ads/TopAdBanner";
import UserDetailAds from "@/components/ads/UserDetailAds";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserPage({ params }: PageProps) {
  const { id } = await params;

  let playerInfo = undefined;
  try {
    playerInfo = await userService.getPlayerInfo(id);
  } catch (error) {
    console.error("Failed to fetch user info:", error);
  }

  if (!playerInfo) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <i className="fas fa-exclamation-triangle text-4xl text-yellow-500"></i>
        <h2 className="text-xl font-bold">사용자를 찾을 수 없습니다.</h2>
        <p className="text-gray-500">닉네임을 다시 확인해주세요.</p>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 mb-6">
        {/* Mobile Ad Banner */}
        <div className="md:hidden flex justify-center">
          <TopAdBanner />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
          {/* 시즌 전체 정보 - Mobile Order: 2 */}
          <div className="order-2 md:col-span-3 md:order-2 self-start">
            <SeasonStats playerInfo={playerInfo} />
          </div>

          {/* Header + Recent Games + Ads - Mobile Order: 1, 3, 4 */}
          <div className="contents md:block md:col-span-7 md:order-1 md:space-y-6">
            {/* Header - Mobile Order: 1 */}
            <div className="order-1">
              <UserHeader playerInfo={playerInfo} />
            </div>

            {/* Recent Games - Mobile Order: 3 */}
            <div className="order-3 mt-6 md:mt-0">
               <RecentGames nexonOuid={playerInfo.nexonOuid} />
            </div>

            {/* Ads - Mobile Order: 4 (Inside grid row) */}
            <div className="order-4 mt-6 md:mt-0">
               <UserDetailAds />
            </div>
          </div>
        </div>

        {/* 히스토리 - 전체 너비 */}
        <UserRecord nexonOuid={playerInfo.nexonOuid} />
      </div>
    </MainLayout>
  );
}
