import { useState } from "react";
import { Trophy, Medal, Activity } from "lucide-react";
import { LiveScores } from "./LiveScores";
import { Leaderboard } from "./Leaderboard";
import { TournamentBracket } from "./TournamentBracket";

interface SportPageProps {
  sport: string;
}

export function SportPage({ sport }: SportPageProps) {
  const sportName = sport
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const [activeTab, setActiveTab] = useState<"scores" | "leaderboard" | "bracket">("scores");

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-5xl text-white mb-3 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
          {sportName}
        </h1>
        <p className="text-indigo-300">Live tournament updates</p>
      </div>

      <div className="mb-8">
        <div className="inline-flex gap-1 bg-[#0f1629]/60 backdrop-blur-sm rounded-2xl p-1.5 border border-indigo-500/20 mx-auto block w-fit">
          <button
            onClick={() => setActiveTab("scores")}
            className={`relative flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
              activeTab === "scores"
                ? "text-white"
                : "text-indigo-300 hover:text-white"
            }`}
          >
            {activeTab === "scores" && (
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl" />
            )}
            <Activity className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Live Scores</span>
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`relative flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
              activeTab === "leaderboard"
                ? "text-white"
                : "text-indigo-300 hover:text-white"
            }`}
          >
            {activeTab === "leaderboard" && (
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl" />
            )}
            <Medal className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Leaderboard</span>
          </button>
          <button
            onClick={() => setActiveTab("bracket")}
            className={`relative flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
              activeTab === "bracket"
                ? "text-white"
                : "text-indigo-300 hover:text-white"
            }`}
          >
            {activeTab === "bracket" && (
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl" />
            )}
            <Trophy className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Bracket</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {activeTab === "scores" && <LiveScores sport={sport} />}
        {activeTab === "leaderboard" && <Leaderboard sport={sport} />}
        {activeTab === "bracket" && <TournamentBracket sport={sport} />}
      </div>
    </div>
  );
}
