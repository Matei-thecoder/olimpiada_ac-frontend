import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { SportPage } from "./components/SportPage";
import { AdminPanel } from "./components/AdminPanel";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "football", Component: () => <SportPage sport="football" /> },
      { path: "volleyball", Component: () => <SportPage sport="volleyball" /> },
      { path: "basketball", Component: () => <SportPage sport="basketball" /> },
      { path: "cross", Component: () => <SportPage sport="cross" /> },
      { path: "ping-pong", Component: () => <SportPage sport="ping-pong" /> },
      { path: "chess", Component: () => <SportPage sport="chess" /> },
      { path: "table-tennis", Component: () => <SportPage sport="table-tennis" /> },
      { path: "rummy", Component: () => <SportPage sport="rummy" /> },
      { path: "badminton", Component: () => <SportPage sport="badminton" /> },
      { path: "billiard", Component: () => <SportPage sport="billiard" /> },
      { path: "bowling", Component: () => <SportPage sport="bowling" /> },
      { path: "admin", Component: AdminPanel },
      { path: "*", Component: NotFound },
    ],
  },
]);
