import { useState } from "react";
import { Settings, Save, RefreshCw, AlertCircle } from "lucide-react";

export function AdminPanel() {
  const [selectedSport, setSelectedSport] = useState("football");
  const [selectedMatch, setSelectedMatch] = useState("1");

  const sports = [
    "football",
    "volleyball",
    "basketball",
    "cross",
    "ping-pong",
    "chess",
    "table-tennis",
    "rummy",
    "badminton",
    "billiard",
    "bowling",
  ];

  const matches = [
    { id: "1", team1: "Team Alpha", team2: "Team Beta", score1: 2, score2: 1 },
    { id: "2", team1: "Team Gamma", team2: "Team Delta", score1: 3, score2: 3 },
    { id: "3", team1: "Team Epsilon", team2: "Team Zeta", score1: 0, score2: 0 },
  ];

  const [team1Score, setTeam1Score] = useState("2");
  const [team2Score, setTeam2Score] = useState("1");
  const [matchStatus, setMatchStatus] = useState<"live" | "upcoming" | "finished">("live");

  const handleSaveScore = () => {
    alert(`Score updated for ${selectedSport}: ${team1Score} - ${team2Score}`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 rounded-full blur-xl opacity-50" />
              <Settings className="relative w-12 h-12 text-pink-400" />
            </div>
          </div>
          <h1 className="text-5xl text-white mb-3 bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-indigo-300">Manage scores and tournament data</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-amber-900/10 border border-amber-500/30 p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-amber-200 text-sm">
              <strong>Admin Access:</strong> Changes made here will update live scores, leaderboards, and brackets in real-time for all users.
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-[#0f1629]/40 backdrop-blur-sm border border-indigo-500/20 p-6">
            <h2 className="text-xl text-white mb-4">Select Sport</h2>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0e27] text-white rounded-xl border border-indigo-500/30 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              {sports.map((sport) => (
                <option key={sport} value={sport}>
                  {sport.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl bg-[#0f1629]/40 backdrop-blur-sm border border-indigo-500/20 p-6">
            <h2 className="text-xl text-white mb-4">Select Match</h2>
            <select
              value={selectedMatch}
              onChange={(e) => {
                setSelectedMatch(e.target.value);
                const match = matches.find((m) => m.id === e.target.value);
                if (match) {
                  setTeam1Score(match.score1.toString());
                  setTeam2Score(match.score2.toString());
                }
              }}
              className="w-full px-4 py-3 bg-[#0a0e27] text-white rounded-xl border border-indigo-500/30 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              {matches.map((match) => (
                <option key={match.id} value={match.id}>
                  {match.team1} vs {match.team2}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl bg-[#0f1629]/40 backdrop-blur-sm border border-indigo-500/20 p-6">
            <h2 className="text-xl text-white mb-6">Update Score</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-indigo-300 mb-2 uppercase text-sm tracking-wider">Team 1 Score</label>
                <input
                  type="number"
                  value={team1Score}
                  onChange={(e) => setTeam1Score(e.target.value)}
                  className="w-full px-4 py-4 bg-[#0a0e27] text-white rounded-xl border border-indigo-500/30 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-3xl text-center font-mono transition-all"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-indigo-300 mb-2 uppercase text-sm tracking-wider">Team 2 Score</label>
                <input
                  type="number"
                  value={team2Score}
                  onChange={(e) => setTeam2Score(e.target.value)}
                  className="w-full px-4 py-4 bg-[#0a0e27] text-white rounded-xl border border-indigo-500/30 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-3xl text-center font-mono transition-all"
                  min="0"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-indigo-300 mb-2 uppercase text-sm tracking-wider">Match Status</label>
              <select
                value={matchStatus}
                onChange={(e) => setMatchStatus(e.target.value as "live" | "upcoming" | "finished")}
                className="w-full px-4 py-3 bg-[#0a0e27] text-white rounded-xl border border-indigo-500/30 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              >
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="finished">Finished</option>
              </select>
            </div>

            <button
              onClick={handleSaveScore}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/20"
            >
              <Save className="w-5 h-5" />
              Save Score Update
            </button>
          </div>

          <div className="rounded-2xl bg-[#0f1629]/40 backdrop-blur-sm border border-indigo-500/20 p-6">
            <h2 className="text-xl text-white mb-4">Quick Actions</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Refresh All Data
              </button>

              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                <Settings className="w-5 h-5" />
                Tournament Settings
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-indigo-400 text-sm">
          All updates are synchronized in real-time across all devices
        </div>
      </div>
    </div>
  );
}
