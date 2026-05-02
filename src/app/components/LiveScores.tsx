import { useState, useEffect, useRef } from "react";
import { Clock, Circle } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:3001/ws";

interface LiveScoresProps {
  sport: string;
}

interface Match {
  _id: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  status: "live" | "upcoming" | "finished";
  time?: string;
}

export function LiveScores({ sport }: LiveScoresProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  async function fetchMatches() {
    try {
      const res = await fetch(`${API_BASE}/api/${sport}/matches/live`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMatches(data);
      setError(null);
    } catch (err) {
      setError("Failed to load matches");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMatches();

    // WebSocket for real-time updates
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (
        (msg.type === "match_update" || msg.type === "match_created") &&
        (msg.sport === sport || msg.type === "refresh_all")
      ) {
        fetchMatches();
      }
    };

    ws.onerror = () => {
      // WS unavailable — polling fallback every 10 s
      const interval = setInterval(fetchMatches, 10_000);
      ws.onclose = () => clearInterval(interval);
    };

    return () => {
      ws.close();
    };
  }, [sport]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-[#0f1629]/40 border border-indigo-500/20 p-6 animate-pulse h-32"
          />
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

  if (matches.length === 0) {
    return (
      <div className="rounded-2xl bg-[#0f1629]/40 border border-indigo-500/20 p-12 text-center text-indigo-400">
        No matches scheduled yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <div
          key={match._id}
          className="relative overflow-hidden rounded-2xl bg-[#0f1629]/40 backdrop-blur-sm border border-indigo-500/20 p-6 hover:border-indigo-400/40 transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {match.status === "live" && (
                <>
                  <div className="relative">
                    <Circle className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
                    <Circle className="absolute inset-0 w-3 h-3 text-red-500 fill-red-500 animate-ping opacity-75" />
                  </div>
                  <span className="text-red-400 uppercase text-sm tracking-wider">Live</span>
                </>
              )}
              {match.status === "upcoming" && (
                <>
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span className="text-indigo-400 uppercase text-sm tracking-wider">Upcoming</span>
                </>
              )}
              {match.status === "finished" && (
                <span className="text-emerald-400 uppercase text-sm tracking-wider">Finished</span>
              )}
            </div>
            {match.time && (
              <span className="text-indigo-300 font-mono">{match.time}</span>
            )}
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-center">
            <div className="text-right">
              <div className="text-xl text-white">{match.team1}</div>
            </div>

            <div className="flex items-center gap-4 px-6">
              <div
                className={`text-4xl font-mono ${
                  match.score1 > match.score2
                    ? "text-transparent bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text"
                    : "text-white/60"
                }`}
              >
                {match.score1}
              </div>
              <div className="w-px h-8 bg-indigo-500/30" />
              <div
                className={`text-4xl font-mono ${
                  match.score2 > match.score1
                    ? "text-transparent bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text"
                    : "text-white/60"
                }`}
              >
                {match.score2}
              </div>
            </div>

            <div className="text-left">
              <div className="text-xl text-white">{match.team2}</div>
            </div>
          </div>
        </div>
      ))}

      <div className="text-center text-indigo-400 text-sm mt-8">
        Scores update automatically in real-time
      </div>
    </div>
  );
}
