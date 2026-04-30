import { Outlet, NavLink } from "react-router";
import { Trophy, Menu, X } from "lucide-react";
import { useState } from "react";

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sports = [
    { name: "Football", path: "/football" },
    { name: "Volleyball", path: "/volleyball" },
    { name: "Basketball", path: "/basketball" },
    { name: "Cross", path: "/cross" },
    { name: "Ping Pong", path: "/ping-pong" },
    { name: "Chess", path: "/chess" },
    { name: "Table Tennis", path: "/table-tennis" },
    { name: "Rummy", path: "/rummy" },
    { name: "Badminton", path: "/badminton" },
    { name: "Billiard", path: "/billiard" },
    { name: "Bowling", path: "/bowling" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e27]">
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSg5OSwgMTAyLCAyNDEsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40 pointer-events-none" />

      <header className="relative bg-[#0f1629]/80 backdrop-blur-xl border-b border-indigo-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <NavLink to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity" />
                <Trophy className="relative w-8 h-8 text-yellow-400" />
              </div>
              <span className="text-xl text-white font-semibold">OLYMPIAD</span>
            </NavLink>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <nav className="hidden lg:flex items-center gap-1">
              {sports.map((sport) => (
                <NavLink
                  key={sport.path}
                  to={sport.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg transition-all relative ${
                      isActive
                        ? "text-white"
                        : "text-indigo-200 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg" />
                      )}
                      <span className="relative">{sport.name}</span>
                    </>
                  )}
                </NavLink>
              ))}
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg transition-all relative ml-2 ${
                    isActive
                      ? "text-white"
                      : "text-pink-300 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600 rounded-lg" />
                    )}
                    <span className="relative">Admin</span>
                  </>
                )}
              </NavLink>
            </nav>
          </div>

          {mobileMenuOpen && (
            <nav className="lg:hidden pb-4 flex flex-col gap-2">
              {sports.map((sport) => (
                <NavLink
                  key={sport.path}
                  to={sport.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                        : "text-indigo-200 hover:text-white"
                    }`
                  }
                >
                  {sport.name}
                </NavLink>
              ))}
              <NavLink
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-pink-600 to-red-600 text-white"
                      : "text-pink-300 hover:text-white"
                  }`
                }
              >
                Admin
              </NavLink>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1 relative">
        <Outlet />
      </main>

      <footer className="relative bg-[#0f1629]/80 backdrop-blur-xl border-t border-indigo-500/20 py-6">
        <div className="container mx-auto px-4 text-center text-indigo-300">
          <p>© {new Date().getFullYear()} Sports Olympiad - Made with love by lsaciasi</p>
        </div>
      </footer>
    </div>
  );
}
