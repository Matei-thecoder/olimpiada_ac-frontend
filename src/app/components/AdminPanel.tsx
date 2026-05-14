import { useState, useEffect } from "react";
import { Settings, Save, RefreshCw, AlertCircle, Plus, CheckCircle, XCircle } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET ?? "";

const SPORTS = [
  "football", "volleyball", "basketball", "cross",
  "ping-pong", "chess", "table-tennis", "remi", "table",
  "badminton", "billiard", "bowling",
];

const ROUND_POSITIONS: Record<string, number[]> = {
  "group":         [],
  "quarter-final": [1, 2, 3, 4],
  "semi-final":    [1, 2],
  "final":         [1],
};

// Describes what each position feeds into, so the admin knows what they're creating
const POSITION_LABELS: Record<string, Record<number, string>> = {
  "quarter-final": {
    1: "QF1 → winner goes to SF1 as Team 1",
    2: "QF2 → winner goes to SF1 as Team 2",
    3: "QF3 → winner goes to SF2 as Team 1",
    4: "QF4 → winner goes to SF2 as Team 2",
  },
  "semi-final": {
    1: "SF1 → winner goes to Final as Team 1",
    2: "SF2 → winner goes to Final as Team 2",
  },
  "final": {
    1: "Grand Final",
  },
};

interface Match {
  _id: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  status: "live" | "upcoming" | "finished";
  time?: string;
}

interface Team {
  _id: string;
  name: string;
}

type Toast = { type: "success" | "error"; message: string };

function adminFetch(path: string, options: RequestInit = {}) {
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": ADMIN_SECRET,
      ...(options.headers ?? {}),
    },
  });
}

export function AdminPanel() {
  const [activeSection, setActiveSection] = useState<"update" | "create">("update");
  const [toast, setToast] = useState<Toast | null>(null);

  function showToast(type: Toast["type"], message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  // ── Update score ─────────────────────────────
  const [selectedSport, setSelectedSport] = useState("football");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [team1Score, setTeam1Score] = useState("0");
  const [team2Score, setTeam2Score] = useState("0");
  const [matchStatus, setMatchStatus] = useState<"live" | "upcoming" | "finished">("live");
  const [matchTime, setMatchTime] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadMatches(sport: string) {
    setLoadingMatches(true);
    setSelectedMatchId("");
    try {
      const data: Match[] = await adminFetch(`/api/${sport}/matches`).then((r) => r.json());
      setMatches(data);
      if (data.length > 0) {
        const first = data[0];
        setSelectedMatchId(first._id);
        setTeam1Score(String(first.score1));
        setTeam2Score(String(first.score2));
        setMatchStatus(first.status);
        setMatchTime(first.time ?? "");
      }
    } catch {
      showToast("error", "Failed to load matches");
    } finally {
      setLoadingMatches(false);
    }
  }

  useEffect(() => { loadMatches(selectedSport); }, [selectedSport]);

  function handleMatchSelect(id: string) {
    setSelectedMatchId(id);
    const match = matches.find((m) => m._id === id);
    if (match) {
      setTeam1Score(String(match.score1));
      setTeam2Score(String(match.score2));
      setMatchStatus(match.status);
      setMatchTime(match.time ?? "");
    }
  }

  async function handleSaveScore() {
    if (!selectedMatchId) return;
    setSaving(true);
    try {
      const res = await adminFetch(`/api/admin/matches/${selectedMatchId}`, {
        method: "PUT",
        body: JSON.stringify({
          score1: Number(team1Score),
          score2: Number(team2Score),
          status: matchStatus,
          time: matchTime || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      const updated: Match = await res.json();
      setMatches((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
      showToast("success", "Score updated successfully");
    } catch {
      showToast("error", "Failed to save score");
    } finally {
      setSaving(false);
    }
  }

  async function handleRefreshAll() {
    try {
      await adminFetch("/api/admin/refresh", { method: "POST" });
      showToast("success", "All caches cleared and refresh broadcast sent");
    } catch {
      showToast("error", "Refresh failed");
    }
  }

  // ── Create match ─────────────────────────────
  const [newSport, setNewSport] = useState("football");
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [newTeam1, setNewTeam1] = useState("");
  const [newTeam2, setNewTeam2] = useState("");
  const [newScore1, setNewScore1] = useState("0");
  const [newScore2, setNewScore2] = useState("0");
  const [newStatus, setNewStatus] = useState<"live" | "upcoming" | "finished">("upcoming");
  const [newRound, setNewRound] = useState("group");
  const [newBracketPosition, setNewBracketPosition] = useState(1);
  const [newTime, setNewTime] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const positions = ROUND_POSITIONS[newRound];
    setNewBracketPosition(positions.length > 0 ? positions[0] : 0);
  }, [newRound]);

  async function loadTeams(sport: string) {
    setLoadingTeams(true);
    setNewTeam1("");
    setNewTeam2("");
    try {
      const data: Team[] = await adminFetch(`/api/admin/teams/${sport}`).then((r) => r.json());
      setTeams(data);
      if (data.length >= 2) {
        setNewTeam1(data[0].name);
        setNewTeam2(data[1].name);
      }
    } catch {
      showToast("error", "Failed to load teams");
    } finally {
      setLoadingTeams(false);
    }
  }

  useEffect(() => { loadTeams(newSport); }, [newSport]);

  async function handleCreateMatch() {
    if (!newTeam1 || !newTeam2) { showToast("error", "Please select both teams"); return; }
    if (newTeam1 === newTeam2)  { showToast("error", "Team 1 and Team 2 must be different"); return; }

    setCreating(true);
    try {
      const res = await adminFetch("/api/admin/matches", {
        method: "POST",
        body: JSON.stringify({
          sport: newSport,
          team1: newTeam1,
          team2: newTeam2,
          score1: Number(newScore1),
          score2: Number(newScore2),
          status: newStatus,
          round: newRound,
          bracketPosition: newBracketPosition,
          time: newTime || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      showToast("success", "Match created successfully");
      setNewScore1("0");
      setNewScore2("0");
      setNewStatus("upcoming");
      setNewTime("");
      if (newSport === selectedSport) await loadMatches(selectedSport);
    } catch {
      showToast("error", "Failed to create match");
    } finally {
      setCreating(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 bg-[#0a0e27] text-white rounded-xl border border-indigo-500/30 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all";
  const labelClass = "block text-indigo-300 mb-2 uppercase text-sm tracking-wider";

  const positionOptions = ROUND_POSITIONS[newRound] ?? [];
  const positionLabels = POSITION_LABELS[newRound] ?? {};

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Toast */}
        {toast && (
          <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border transition-all ${
            toast.type === "success"
              ? "bg-emerald-900/80 border-emerald-500/40 text-emerald-200"
              : "bg-red-900/80 border-red-500/40 text-red-200"
          }`}>
            {toast.type === "success"
              ? <CheckCircle className="w-5 h-5 text-emerald-400" />
              : <XCircle className="w-5 h-5 text-red-400" />}
            {toast.message}
          </div>
        )}

        {/* Header */}
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

        {/* Warning */}
        <div className="relative overflow-hidden rounded-2xl bg-amber-900/10 border border-amber-500/30 p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-amber-200 text-sm">
              <strong>Admin Access:</strong> Changes made here will update live scores, leaderboards, and brackets in real-time for all users.
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="inline-flex gap-1 bg-[#0f1629]/60 backdrop-blur-sm rounded-2xl p-1.5 border border-indigo-500/20 mb-8">
          {(["update", "create"] as const).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`relative flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                activeSection === section ? "text-white" : "text-indigo-300 hover:text-white"
              }`}
            >
              {activeSection === section && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl" />
              )}
              {section === "update"
                ? <Save className="w-4 h-4 relative z-10" />
                : <Plus className="w-4 h-4 relative z-10" />}
              <span className="relative z-10">
                {section === "update" ? "Update Score" : "Create Match"}
              </span>
            </button>
          ))}
        </div>

        {/* ── UPDATE SCORE ── */}
        {activeSection === "update" && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-[#0f1629]/40 backdrop-blur-sm border border-indigo-500/20 p-6">
              <h2 className="text-xl text-white mb-4">Select Sport</h2>
              <select value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)} className={inputClass}>
                {SPORTS.map((s) => (
                  <option key={s} value={s}>
                    {s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl bg-[#0f1629]/40 backdrop-blur-sm border border-indigo-500/20 p-6">
              <h2 className="text-xl text-white mb-4">Select Match</h2>
              {loadingMatches ? (
                <div className="h-12 rounded-xl bg-indigo-500/10 animate-pulse" />
              ) : matches.length === 0 ? (
                <p className="text-indigo-400 text-sm">No matches found for this sport.</p>
              ) : (
                <select value={selectedMatchId} onChange={(e) => handleMatchSelect(e.target.value)} className={inputClass}>
                  {matches.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.team1} vs {m.team2} — {m.status}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="rounded-2xl bg-[#0f1629]/40 backdrop-blur-sm border border-indigo-500/20 p-6">
              <h2 className="text-xl text-white mb-6">Update Score</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={labelClass}>Team 1 Score</label>
                  <input type="number" value={team1Score} onChange={(e) => setTeam1Score(e.target.value)}
                    className={`${inputClass} text-3xl text-center font-mono`} min="0" />
                </div>
                <div>
                  <label className={labelClass}>Team 2 Score</label>
                  <input type="number" value={team2Score} onChange={(e) => setTeam2Score(e.target.value)}
                    className={`${inputClass} text-3xl text-center font-mono`} min="0" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={labelClass}>Match Status</label>
                  <select value={matchStatus} onChange={(e) => setMatchStatus(e.target.value as typeof matchStatus)} className={inputClass}>
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="finished">Finished</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Match Time (optional)</label>
                  <input type="text" value={matchTime} onChange={(e) => setMatchTime(e.target.value)}
                    placeholder="e.g. 45:30" className={inputClass} />
                </div>
              </div>
              <button onClick={handleSaveScore} disabled={saving || !selectedMatchId}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:opacity-50 text-white px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                <Save className="w-5 h-5" />
                {saving ? "Saving…" : "Save Score Update"}
              </button>
            </div>

            <div className="rounded-2xl bg-[#0f1629]/40 backdrop-blur-sm border border-indigo-500/20 p-6">
              <h2 className="text-xl text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={handleRefreshAll}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Refresh All Data
                </button>
                <button onClick={() => setActiveSection("create")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Match
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── CREATE MATCH ── */}
        {activeSection === "create" && (
          <div className="space-y-6">

            <div className="rounded-2xl bg-[#0f1629]/40 backdrop-blur-sm border border-indigo-500/20 p-6">
              <h2 className="text-xl text-white mb-4">Sport & Round</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Sport</label>
                  <select value={newSport} onChange={(e) => setNewSport(e.target.value)} className={inputClass}>
                    {SPORTS.map((s) => (
                      <option key={s} value={s}>
                        {s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Round</label>
                  <select value={newRound} onChange={(e) => setNewRound(e.target.value)} className={inputClass}>
                    <option value="group">Group Stage</option>
                    <option value="quarter-final">Quarter Final</option>
                    <option value="semi-final">Semi Final</option>
                    <option value="final">Final</option>
                  </select>
                </div>
              </div>

              {/* Bracket position — only shown for non-group rounds */}
              {positionOptions.length > 0 && (
                <div className="mt-6">
                  <label className={labelClass}>Bracket Position</label>
                  <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${positionOptions.length}, 1fr)` }}>
                    {positionOptions.map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setNewBracketPosition(pos)}
                        className={`p-3 rounded-xl border text-sm transition-all text-left ${
                          newBracketPosition === pos
                            ? "bg-indigo-600 border-indigo-400 text-white"
                            : "bg-[#0a0e27] border-indigo-500/30 text-indigo-300 hover:border-indigo-400"
                        }`}
                      >
                        <div className="font-bold mb-1">Position {pos}</div>
                        <div className="text-xs opacity-75">{positionLabels[pos]}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-[#0f1629]/40 backdrop-blur-sm border border-indigo-500/20 p-6">
              <h2 className="text-xl text-white mb-6">Teams & Scores</h2>
              {loadingTeams ? (
                <div className="h-12 rounded-xl bg-indigo-500/10 animate-pulse mb-6" />
              ) : teams.length === 0 ? (
                <p className="text-indigo-400 text-sm mb-6">No teams found for this sport. Seed the database first.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className={labelClass}>Team 1</label>
                    <select value={newTeam1} onChange={(e) => setNewTeam1(e.target.value)} className={inputClass}>
                      {teams.map((t) => (
                        <option key={t._id} value={t.name}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Team 2</label>
                    <select value={newTeam2} onChange={(e) => setNewTeam2(e.target.value)} className={inputClass}>
                      {teams.map((t) => (
                        <option key={t._id} value={t.name}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Team 1 Score</label>
                  <input type="number" value={newScore1} onChange={(e) => setNewScore1(e.target.value)}
                    className={`${inputClass} text-3xl text-center font-mono`} min="0" />
                </div>
                <div>
                  <label className={labelClass}>Team 2 Score</label>
                  <input type="number" value={newScore2} onChange={(e) => setNewScore2(e.target.value)}
                    className={`${inputClass} text-3xl text-center font-mono`} min="0" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0f1629]/40 backdrop-blur-sm border border-indigo-500/20 p-6">
              <h2 className="text-xl text-white mb-6">Status & Time</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Match Status</label>
                  <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as typeof newStatus)} className={inputClass}>
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="finished">Finished</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Match Time (optional)</label>
                  <input type="text" value={newTime} onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 45:30 or 14:00" className={inputClass} />
                </div>
              </div>
            </div>

            <button onClick={handleCreateMatch} disabled={creating || teams.length === 0}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              {creating ? "Creating…" : "Create Match"}
            </button>
          </div>
        )}

        <div className="mt-8 text-center text-indigo-400 text-sm">
          All updates are synchronized in real-time across all devices
        </div>
      </div>
    </div>
  );
}
