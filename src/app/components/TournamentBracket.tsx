import { useState, useEffect, useRef } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:3001/ws";

interface TournamentBracketProps {
  sport: string;
}

interface BracketMatch {
  _id: string;
  team1: string;
  team2: string;
  score1?: number;
  score2?: number;
  winner?: string;
  status: string;
}

interface Bracket {
  quarterFinals: BracketMatch[];
  semiFinals: BracketMatch[];
  finals: BracketMatch[];
}

export function TournamentBracket({ sport }: TournamentBracketProps) {
  const [bracket, setBracket] = useState<Bracket>({ quarterFinals: [], semiFinals: [], finals: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  async function fetchBracket() {
    try {
      const res = await fetch(`${API_BASE}/api/${sport}/bracket`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setBracket(data);
      setError(null);
    } catch {
      setError("Failed to load bracket");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchBracket();

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (
        msg.type === "refresh_all" ||
        msg.type === "match_created" ||
        (msg.type === "match_update" && msg.sport === sport)
      ) {
        fetchBracket();
      }
    };

    ws.onerror = () => {
      const interval = setInterval(fetchBracket, 15_000);
      ws.onclose = () => clearInterval(interval);
    };

    return () => {
      ws.close();
    };
  }, [sport]);

  const renderMatch = (match: BracketMatch, isFinal?: boolean) => (
    <div
      className={`relative rounded-xl bg-[#0f1629]/60 backdrop-blur-sm border ${
        isFinal ? "border-yellow-500/50" : "border-indigo-500/30"
      } p-4 w-64 hover:border-indigo-400/50 transition-all`}
    >
      {isFinal && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs uppercase tracking-wider">
          Final
        </div>
      )}
      <div className="space-y-2">
        <div
          className={`flex items-center justify-between p-3 rounded-lg transition-all ${
            match.winner === match.team1
              ? "bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/40"
              : "bg-indigo-500/5"
          }`}
        >
          <span className={match.winner === match.team1 ? "text-white" : "text-indigo-200"}>
            {match.team1}
          </span>
          {match.score1 !== undefined && (
            <span
              className={`font-mono text-xl ${
                match.winner === match.team1
                  ? "text-transparent bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text"
                  : "text-indigo-300"
              }`}
            >
              {match.score1}
            </span>
          )}
        </div>
        <div
          className={`flex items-center justify-between p-3 rounded-lg transition-all ${
            match.winner === match.team2
              ? "bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/40"
              : "bg-indigo-500/5"
          }`}
        >
          <span className={match.winner === match.team2 ? "text-white" : "text-indigo-200"}>
            {match.team2}
          </span>
          {match.score2 !== undefined && (
            <span
              className={`font-mono text-xl ${
                match.winner === match.team2
                  ? "text-transparent bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text"
                  : "text-indigo-300"
              }`}
            >
              {match.score2}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex gap-24 justify-center px-8 overflow-x-auto pb-8">
        {[4, 2, 1].map((count, col) => (
          <div key={col} className="flex flex-col gap-16">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="w-64 h-28 rounded-xl bg-[#0f1629]/40 border border-indigo-500/20 animate-pulse" />
            ))}
          </div>
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

  const { quarterFinals, semiFinals, finals } = bracket;

  return (
    <div className="overflow-x-auto pb-8">
      <div className="min-w-max px-8">
        <div className="relative flex gap-24 justify-center">
          <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%" }}>
            <line x1="33%" y1="17%" x2="44%" y2="17%" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="2" />
            <line x1="44%" y1="17%" x2="44%" y2="28%" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="2" />
            <line x1="44%" y1="28%" x2="50.5%" y2="28%" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="2" />
            <line x1="33%" y1="39%" x2="44%" y2="39%" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="2" />
            <line x1="44%" y1="39%" x2="44%" y2="28%" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="2" />
            <line x1="33%" y1="61%" x2="44%" y2="61%" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="2" />
            <line x1="44%" y1="61%" x2="44%" y2="72%" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="2" />
            <line x1="44%" y1="72%" x2="50.5%" y2="72%" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="2" />
            <line x1="33%" y1="83%" x2="44%" y2="83%" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="2" />
            <line x1="44%" y1="83%" x2="44%" y2="72%" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="2" />
            <line x1="66.5%" y1="28%" x2="73%" y2="28%" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="2" />
            <line x1="73%" y1="28%" x2="73%" y2="50%" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="2" />
            <line x1="73%" y1="50%" x2="78%" y2="50%" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="2" />
            <line x1="66.5%" y1="72%" x2="73%" y2="72%" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="2" />
            <line x1="73%" y1="72%" x2="73%" y2="50%" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="2" />
          </svg>

          {quarterFinals.length > 0 && (
            <div className="flex flex-col gap-16 relative z-10">
              <div className="text-center text-indigo-300 uppercase text-sm tracking-wider mb-4">Quarter Finals</div>
              <div className="space-y-16">
                {quarterFinals.map((match) => <div key={match._id}>{renderMatch(match)}</div>)}
              </div>
            </div>
          )}

          {semiFinals.length > 0 && (
            <div className="flex flex-col gap-16 relative z-10 mt-32">
              <div className="text-center text-indigo-300 uppercase text-sm tracking-wider mb-4">Semi Finals</div>
              <div className="space-y-32">
                {semiFinals.map((match) => <div key={match._id}>{renderMatch(match)}</div>)}
              </div>
            </div>
          )}

          {finals.length > 0 && (
            <div className="flex flex-col gap-16 relative z-10 mt-64">
              <div className="text-center text-indigo-300 uppercase text-sm tracking-wider mb-4">Championship</div>
              {finals.map((match) => <div key={match._id}>{renderMatch(match, true)}</div>)}
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-indigo-400 text-sm mt-12">
        Tournament bracket updates automatically as matches progress
      </div>
    </div>
  );
}
