import { NavLink } from "react-router";
import {
  Trophy,
  Dribbble,
  Globe,
  Circle,
  Crown,
  Target,
  Flame,
  Zap,
  Swords,
  ArrowRight,
} from "lucide-react";

export function Home() {
  const sports = [
    { name: "Ping-Pong", path: "/table-tennis", icon: Flame, gradient: "from-sky-500 to-indigo-600" },
    { name: "Badminton", path: "/badminton", icon: Zap, gradient: "from-lime-500 to-green-600" },

    { name: "Volei", path: "/volleyball", icon: Globe, gradient: "from-amber-500 to-orange-600" },
    { name: "Cross", path: "/cross", icon: Target, gradient: "from-cyan-500 to-blue-600" },
    { name: "Sah", path: "/chess", icon: Crown, gradient: "from-slate-500 to-gray-700" },
    { name: "Remi", path: "/remi", icon: Swords, gradient: "from-violet-500 to-purple-600" },
    { name: "Table", path: "/table", icon: Swords, gradient: "from-violet-500 to-purple-600" },
    { name: "Jocuri interactive", path: "/billiard", icon: Circle, gradient: "from-teal-500 to-emerald-600" },

    { name: "Fotbal", path: "/football", icon: Dribbble, gradient: "from-emerald-500 to-teal-600" },
    { name: "Basketball", path: "/basketball", icon: Circle, gradient: "from-orange-500 to-red-600" },
   
    
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur-xl opacity-50 animate-pulse" />
            <Trophy className="relative w-16 h-16 text-yellow-400" />
          </div>
        </div>
        <h1 className="text-6xl text-white mb-4 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
          Olimpiada AC 2026
        </h1>
        <p className="text-xl text-indigo-300 max-w-2xl mx-auto">
            Scoruri in timp real pentru toate sporturile, actualizate instantaneu pentru a te tine mereu la curent cu ultimele rezultate si clasamente.
          </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto mb-16">
        {sports.map((sport) => {
          const Icon = sport.icon;
          return (
            <NavLink
              key={sport.path}
              to={sport.path}
              className="group relative overflow-hidden rounded-2xl bg-[#0f1629]/40 backdrop-blur-sm border border-indigo-500/20 p-6 hover:border-indigo-400/40 transition-all hover:scale-[1.02]"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${sport.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${sport.gradient}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg text-white">{sport.name}</h3>
                    <p className="text-sm text-indigo-400">Update in timp real</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </NavLink>
          );
        })}
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-[#0f1629]/40 backdrop-blur-sm border border-indigo-500/20 p-8">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text mb-2">
                10
              </div>
              <div className="text-sm text-indigo-300">Sporturi</div>
            </div>
            <div>
              <div className="text-4xl text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text mb-2 flex items-center justify-center gap-2">
                <Circle className="w-3 h-3 text-green-400 fill-green-400 animate-pulse" />
                Update
              </div>
              <div className="text-sm text-indigo-300">In timp real</div>
            </div>
            <div>
              <div className="text-4xl text-transparent bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text mb-2">
                24/7
              </div>
              <div className="text-sm text-indigo-300">Tracking</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
