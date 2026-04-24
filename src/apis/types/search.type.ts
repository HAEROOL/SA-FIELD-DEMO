export interface ClanSearchResult {
  clanId: number;
  clanName: string;
  clanMarkUrl?: string | null;
  clanBackMarkUrl?: string | null;
  division: number;
  // API doc doesn't strictly promise these but service was inferring them.
  // Let's keep distinct fields from API vs UI helpers.

  // UI helper fields - Required after mapping
  id: string;
  name: string;
  tier?: string;
  info?: string;
  // Keep original fields optional if needed or just use mapped ones.
  // Actually, let's keep the interface clean:
}

export interface PlayerSearchResult {
  playerId: number;
  nickName: string;
  clanName?: string | null;
  clanMarkUrl?: string | null;
  clanBackMarkUrl?: string | null;

  // UI helper fields - Required after mapping
  id: string;
  name: string;
  tier?: string;
  info?: string;
}

export type SearchType = "clan" | "player";

