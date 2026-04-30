import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardProps {
  sport: string;
}

interface TeamStats {
  rank: number;
  team: string;
  wins: number;
  losses: number;
  points: number;
}

export function Leaderboard({ sport }: LeaderboardProps) {
  const teams: TeamStats[] = [
    { rank: 1, team: "Team Alpha", wins: 8, losses: 1, points: 24 },
    { rank: 2, team: "Team Beta", wins: 7, losses: 2, points: 21 },
    { rank: 3, team: "Team Gamma", wins: 6, losses: 3, points: 18 },
    { rank: 4, team: "Team Delta", wins: 5, losses: 4, points: 15 },
    { rank: 5, team: "Team Epsilon", wins: 4, losses: 5, points: 12 },
    { rank: 6, team: "Team Zeta", wins: 3, losses: 6, points: 9 },
    { rank: 7, team: "Team Eta", wins: 2, losses: 7, points: 6 },
    { rank: 8, team: "Team Theta", wins: 1, losses: 8, points: 3 },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return null;
  };

  const getRankStyles = (rank: number) => {
    if (rank === 1) return "bg-yellow-500/10 border-l-4 border-l-yellow-500";
    if (rank === 2) return "bg-gray-500/10 border-l-4 border-l-gray-400";
    if (rank === 3) return "bg-amber-500/10 border-l-4 border-l-amber-600";
    return "";
  };

  return (
    <div className="rounded-2xl bg-[#0f1629]/40 backdrop-blur-sm border border-indigo-500/20 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-indigo-500/20">
              <th className="text-left p-4 text-indigo-300 uppercase text-sm tracking-wider">Rank</th>
              <th className="text-left p-4 text-indigo-300 uppercase text-sm tracking-wider">Team</th>
              <th className="text-center p-4 text-indigo-300 uppercase text-sm tracking-wider">W</th>
              <th className="text-center p-4 text-indigo-300 uppercase text-sm tracking-wider">L</th>
              <th className="text-center p-4 text-indigo-300 uppercase text-sm tracking-wider">Points</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr
                key={team.rank}
                className={`border-b border-indigo-500/10 hover:bg-indigo-500/5 transition-colors ${getRankStyles(
                  team.rank
                )}`}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {getRankIcon(team.rank)}
                    <span className="text-2xl text-white font-mono">#{team.rank}</span>
                  </div>
                </td>
                <td className="p-4 text-white text-lg">{team.team}</td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono">
                    {team.wins}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/20 text-red-400 font-mono">
                    {team.losses}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-2xl font-mono text-transparent bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text">
                    {team.points}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 text-center text-indigo-400 text-sm border-t border-indigo-500/20">
        Leaderboard updates automatically as matches complete
      </div>
    </div>
  );
}
