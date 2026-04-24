import { ClanRanking, PlayerRanking } from '@/types/league';

/**
 * Mock 클랜 랭킹 데이터 (1부)
 */
export const mockClanRankings1st: ClanRanking[] = [
  {
    rank: 1,
    id: 'ultron',
    name: 'Ultron',
    logo: '/images/clans/ultron.png',
    wins: 150,
    losses: 50,
    winRate: 75.0,
    points: 2450,
    division: '1',
  },
  {
    rank: 2,
    id: 'onepoint',
    name: 'OnePoint',
    logo: '/images/clans/onepoint.png',
    wins: 120,
    losses: 56,
    winRate: 68.2,
    points: 2100,
    division: '1',
  },
  {
    rank: 3,
    id: 'lunatic',
    name: 'Lunatic',
    logo: '/images/clans/lunatic.png',
    wins: 98,
    losses: 52,
    winRate: 65.3,
    points: 1980,
    division: '1',
  },
  {
    rank: 4,
    id: 'ever',
    name: 'Ever',
    logo: '/images/clans/ever.png',
    wins: 110,
    losses: 67,
    winRate: 62.1,
    points: 1850,
    division: '1',
  },
  {
    rank: 5,
    id: 'resun',
    name: 'Resun',
    logo: '/images/clans/resun.png',
    wins: 85,
    losses: 61,
    winRate: 58.2,
    points: 1720,
    division: '1',
  },
  {
    rank: 6,
    id: 'freedom',
    name: 'Freedom',
    logo: '/images/clans/freedom.png',
    wins: 78,
    losses: 68,
    winRate: 53.4,
    points: 1650,
    division: '1',
  },
  {
    rank: 7,
    id: 'phoenix',
    name: 'Phoenix',
    logo: '/images/clans/phoenix.png',
    wins: 72,
    losses: 74,
    winRate: 49.3,
    points: 1580,
    division: '1',
  },
  {
    rank: 8,
    id: 'titan',
    name: 'Titan',
    logo: '/images/clans/titan.png',
    wins: 65,
    losses: 81,
    winRate: 44.5,
    points: 1450,
    division: '1',
  },
];

/**
 * Mock 클랜 랭킹 데이터 (2부)
 */
export const mockClanRankings2nd: ClanRanking[] = [
  {
    rank: 1,
    id: 'raiders',
    name: 'Raiders',
    logo: '/images/clans/raiders.png',
    wins: 95,
    losses: 45,
    winRate: 67.9,
    points: 1850,
    division: '2',
  },
  {
    rank: 2,
    id: 'storm',
    name: 'Storm',
    logo: '/images/clans/storm.png',
    wins: 88,
    losses: 52,
    winRate: 62.9,
    points: 1720,
    division: '2',
  },
  {
    rank: 3,
    id: 'alpha',
    name: 'Alpha',
    logo: '/images/clans/alpha.png',
    wins: 82,
    losses: 58,
    winRate: 58.6,
    points: 1650,
    division: '2',
  },
];

/**
 * Mock 플레이어 랭킹 데이터 (1부)
 */
export const mockPlayerRankings1st: PlayerRanking[] = [
  {
    rank: 1,
    id: 'sa_king',
    nickname: 'sa_king☆',
    clan: {
      id: 'ultron',
      name: 'Ultron',
      logo: '/images/clans/ultron.png',
    },
    wins: 450,
    losses: 120,
    winRate: 78.9,
    kd: 65.0,
    points: 3200,
    division: '1',
  },
  {
    rank: 2,
    id: 'rifle_god',
    nickname: 'Rifle_God',
    clan: {
      id: 'onepoint',
      name: 'OnePoint',
      logo: '/images/clans/onepoint.png',
    },
    wins: 380,
    losses: 150,
    winRate: 71.7,
    kd: 62.0,
    points: 2980,
    division: '1',
  },
  {
    rank: 3,
    id: 'sniper_no1',
    nickname: 'Sniper_No1',
    clan: {
      id: 'lunatic',
      name: 'Lunatic',
      logo: '/images/clans/lunatic.png',
    },
    wins: 320,
    losses: 110,
    winRate: 74.4,
    kd: 68.0,
    points: 2750,
    division: '1',
  },
  {
    rank: 4,
    id: 'heads_up',
    nickname: 'Heads_Up',
    clan: {
      id: 'ever',
      name: 'Ever',
      logo: '/images/clans/ever.png',
    },
    wins: 350,
    losses: 233,
    winRate: 60.0,
    kd: 60.0,
    points: 2540,
    division: '1',
  },
  {
    rank: 5,
    id: 'fast_react',
    nickname: 'Fast_React',
    clan: null, // 무소속 플레이어
    wins: 290,
    losses: 201,
    winRate: 59.1,
    kd: 59.0,
    points: 2300,
    division: '1',
  },
  {
    rank: 6,
    id: 'ace_player',
    nickname: 'Ace_Player',
    clan: {
      id: 'resun',
      name: 'Resun',
      logo: '/images/clans/resun.png',
    },
    wins: 275,
    losses: 215,
    winRate: 56.1,
    kd: 57.0,
    points: 2180,
    division: '1',
  },
  {
    rank: 7,
    id: 'shadow_walker',
    nickname: 'Shadow_Walker',
    clan: null, // 무소속 플레이어
    wins: 260,
    losses: 230,
    winRate: 53.1,
    kd: 55.0,
    points: 2050,
    division: '1',
  },
  {
    rank: 8,
    id: 'pro_gamer',
    nickname: 'Pro_Gamer',
    clan: {
      id: 'freedom',
      name: 'Freedom',
      logo: '/images/clans/freedom.png',
    },
    wins: 245,
    losses: 245,
    winRate: 50.0,
    kd: 52.0,
    points: 1920,
    division: '1',
  },
];

/**
 * Mock 플레이어 랭킹 데이터 (2부)
 */
export const mockPlayerRankings2nd: PlayerRanking[] = [
  {
    rank: 1,
    id: 'rising_star',
    nickname: 'Rising_Star',
    clan: {
      id: 'raiders',
      name: 'Raiders',
      logo: '/images/clans/raiders.png',
    },
    wins: 310,
    losses: 140,
    winRate: 68.9,
    kd: 63.0,
    points: 2450,
    division: '2',
  },
  {
    rank: 2,
    id: 'thunder_bolt',
    nickname: 'Thunder_Bolt',
    clan: {
      id: 'storm',
      name: 'Storm',
      logo: '/images/clans/storm.png',
    },
    wins: 285,
    losses: 165,
    winRate: 63.3,
    kd: 60.0,
    points: 2280,
    division: '2',
  },
];

/**
 * Mock 데이터 생성 헬퍼 함수
 */
function generateClanRankings(startRank: number, count: number, division: string): ClanRanking[] {
  const clanNames = [
    'Storm', 'Dragon', 'Phoenix', 'Titan', 'Shadow', 'Viper', 'Falcon', 'Thunder',
    'Blaze', 'Frost', 'Nova', 'Eclipse', 'Inferno', 'Tempest', 'Apex', 'Zenith',
    'Omega', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Sigma', 'Raven', 'Wolf',
    'Lion', 'Tiger', 'Bear', 'Eagle', 'Shark', 'Cobra', 'Panther', 'Hawk'
  ];

  return Array.from({ length: count }, (_, i) => {
    const rank = startRank + i;
    const basePoints = 2500 - (rank * 50);
    const wins = Math.floor(150 - (rank * 3));
    const losses = Math.floor(50 + (rank * 2));
    const winRate = (wins / (wins + losses)) * 100;

    return {
      rank,
      id: `clan_${rank}`,
      name: clanNames[rank % clanNames.length] || `Clan ${rank}`,
      logo: `/images/clans/clan${rank}.png`,
      wins,
      losses,
      winRate: Math.round(winRate * 10) / 10,
      points: Math.max(1000, basePoints),
      division,
    };
  });
}

function generatePlayerRankings(startRank: number, count: number, division: string): PlayerRanking[] {
  const nicknames = [
    'ProGamer', 'SniperKing', 'HeadHunter', 'FastShot', 'Tactical', 'Veteran',
    'Champion', 'Warrior', 'Slayer', 'Hunter', 'Ace', 'Elite', 'Master', 'Legend',
    'Phantom', 'Ghost', 'Ninja', 'Samurai', 'Knight', 'Paladin', 'Ranger', 'Mage',
    'Wizard', 'Rogue', 'Assassin', 'Berserker', 'Guardian', 'Sentinel', 'Striker', 'Vanguard'
  ];

  const clans = ['Ultron', 'OnePoint', 'Lunatic', 'Ever', 'Resun'];

  return Array.from({ length: count }, (_, i) => {
    const rank = startRank + i;
    const basePoints = 3300 - (rank * 40);
    const wins = Math.floor(500 - (rank * 5));
    const losses = Math.floor(100 + (rank * 3));
    const winRate = (wins / (wins + losses)) * 100;
    const kd = Math.max(45, 70 - rank * 0.5);
    const hasClan = rank % 3 !== 0; // 3의 배수는 무소속

    return {
      rank,
      id: `player_${rank}`,
      nickname: `${nicknames[rank % nicknames.length]}☆`,
      clan: hasClan ? {
        id: `clan_${(rank % clans.length) + 1}`,
        name: clans[rank % clans.length],
        logo: `/images/clans/${clans[rank % clans.length].toLowerCase()}.png`,
      } : null,
      wins,
      losses,
      winRate: Math.round(winRate * 10) / 10,
      kd: Math.round(kd * 10) / 10,
      points: Math.max(1500, basePoints),
      division,
    };
  });
}

/**
 * 부별로 클랜 랭킹 데이터 가져오기 (확장된 데이터)
 */
export function getClanRankingsByDivision(division: string): ClanRanking[] {
  const baseData = division === '1' ? mockClanRankings1st : division === '2' ? mockClanRankings2nd : [];
  const additionalData = generateClanRankings(baseData.length + 1, 50, division);
  return [...baseData, ...additionalData];
}

/**
 * 부별로 플레이어 랭킹 데이터 가져오기 (확장된 데이터)
 */
export function getPlayerRankingsByDivision(division: string): PlayerRanking[] {
  const baseData = division === '1' ? mockPlayerRankings1st : division === '2' ? mockPlayerRankings2nd : [];
  const additionalData = generatePlayerRankings(baseData.length + 1, 50, division);
  return [...baseData, ...additionalData];
}
