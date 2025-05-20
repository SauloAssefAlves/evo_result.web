import { Routes, Route } from "react-router";

import Login from "./pages/login/index.tsx";
import Clientes from "./pages/clientes/index.tsx";
import Dashboard from "./pages/dashboard/index.tsx";
import Tintim from "./pages/tintim/index.tsx";
import Pipelines from "./pages/pipelines/index.tsx";
import Portais from "./pages/portais/index.tsx";
export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="clientes" element={<Clientes />} />
        <Route path="clientes/:id/pipelines" element={<Pipelines />} />
        <Route path="tintim" element={<Tintim />} />
        <Route path="portais" element={<Portais />} />
      </Route>
    </Routes>
  );
}
