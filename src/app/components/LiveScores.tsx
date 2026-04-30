import { useState } from "react";
import { Clock, Circle } from "lucide-react";

interface LiveScoresProps {
  sport: string;
}

interface Match {
  id: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  status: "live" | "upcoming" | "finished";
  time?: string;
}

export function LiveScores({ sport }: LiveScoresProps) {
  const [matches] = useState<Match[]>([
    {
      id: "1",
      team1: "Team Alpha",
      team2: "Team Beta",
      score1: 2,
      score2: 1,
      status: "live",
      time: "45:30",
    },
    {
      id: "2",
      team1: "Team Gamma",
      team2: "Team Delta",
      score1: 3,
      score2: 3,
      status: "live",
      time: "67:15",
    },
    {
      id: "3",
      team1: "Team Epsilon",
      team2: "Team Zeta",
      score1: 0,
      score2: 0,
      status: "upcoming",
      time: "14:00",
    },
    {
      id: "4",
      team1: "Team Eta",
      team2: "Team Theta",
      score1: 4,
      score2: 2,
      status: "finished",
    },
  ]);

  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <div
          key={match.id}
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
