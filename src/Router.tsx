import { Routes, Route } from "react-router";

import Login from "./pages/login/index.tsx";
import Clientes from "./pages/clientes/index.tsx";
import Dashboard from "./pages/dashboard/index.tsx";
import Tintim from "./pages/tintim/index.tsx";
export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="clientes" element={<Clientes />} />
        <Route path="tintim" element={<Tintim />} />
      </Route>
    </Routes>
  );
}
