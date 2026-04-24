export interface RankBadgeProps {
  rank: number;
}

export default function RankBadge({ rank }: RankBadgeProps) {
  return <span className="font-bold text-gray-500 dark:text-gray-400">{rank}</span>;
}
