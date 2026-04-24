"use client";

import { useState } from "react";
import ClanTabs from "./ClanTabs";
import ClanRecord from "./ClanRecord";
import ClanMembers from "./ClanMembers";

import { ClanInfo } from "@/apis/types/clan.type";

interface ClanContentProps {
  clanId?: number;
  clanInfo?: ClanInfo;
}

export default function ClanContent({ clanId, clanInfo }: ClanContentProps) {
  const [activeTab, setActiveTab] = useState("record");

  return (
    <div>
      <ClanTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "record" && (
        <ClanRecord clanId={clanId} clanInfo={clanInfo} />
      )}
      {activeTab === "members" && <ClanMembers clanId={clanId} clanInfo={clanInfo} />}
    </div>
  );
}
