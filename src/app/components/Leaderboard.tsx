import { useState, useEffect, useRef } from "react";
import { Trophy, Medal, Award } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:3001/ws";

interface LeaderboardProps {
  sport: string;
}

interface TeamStats {
  _id: string;
  rank: number;
  name: string;
  wins: number;
  losses: number;
  points: number;
}

export function Leaderboard({ sport }: LeaderboardProps) {
  const [teams, setTeams] = useState<TeamStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  async function fetchLeaderboard() {
    try {
      const res = await fetch(`${API_BASE}/api/${sport}/leaderboard`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTeams(data);
      setError(null);
    } catch {
      setError("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchLeaderboard();

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (
        msg.type === "leaderboard_update" ||
        msg.type === "refresh_all" ||
        (msg.type === "match_update" && msg.sport === sport)
      ) {
        fetchLeaderboard();
      }
    };

    ws.onerror = () => {
      const interval = setInterval(fetchLeaderboard, 15_000);
      ws.onclose = () => clearInterval(interval);
    };

    return () => {
      ws.close();
    };
  }, [sport]);

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

  if (loading) {
    return (
      <div className="rounded-2xl bg-[#0f1629]/40 border border-indigo-500/20 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 border-b border-indigo-500/10 animate-pulse bg-indigo-500/5" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-900/20 border border-red-500/30 p-6 text-center text-red-400">
        {error}
      </div>
    );
  }

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
            {teams.map((team) => (
              <tr
                key={team._id}
                className={`border-b border-indigo-500/10 hover:bg-indigo-500/5 transition-colors ${getRankStyles(team.rank)}`}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {getRankIcon(team.rank)}
                    <span className="text-2xl text-white font-mono">#{team.rank}</span>
                  </div>
                </td>
                <td className="p-4 text-white text-lg">{team.name}</td>
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
