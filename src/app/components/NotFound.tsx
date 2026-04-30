import { NavLink } from "react-router";
import { AlertCircle, ArrowLeft } from "lucide-react";

export function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <div className="inline-flex items-center justify-center mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-xl opacity-50" />
          <AlertCircle className="relative w-24 h-24 text-red-400" />
        </div>
      </div>
      <h1 className="text-6xl text-white mb-4 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
        404
      </h1>
      <p className="text-xl text-indigo-300 mb-8">
        The page you're looking for doesn't exist
      </p>
      <NavLink
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Return Home
      </NavLink>
    </div>
  );
}
