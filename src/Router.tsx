import { Routes, Route } from "react-router";

import Login from "./pages/login/index.tsx";
import Clientes from "./pages/clientes/index.tsx";
import Dashboard from "./pages/dashboard/index.tsx";
import Tintim from "./pages/tintim/index.tsx";
import Pipelines from "./pages/pipelines/index.tsx";
import Portais from "./pages/portais/index.tsx";
import MonitoramentoTintim from "./pages/monitoramentoTintim/index.tsx";
import MonitoramentoPortais from "./pages/monitoramentoPortais/index.tsx";
import SideBar from "./components/SideBar/index.tsx";
export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<SideBar />}>
        <Route path="clientes" element={<Clientes />} />
        <Route path="clientes/:id/pipelines" element={<Pipelines />} />
        <Route path="tintim" element={<Tintim />} />
        <Route
          path="tintim/monitoramento/:id?"
          element={<MonitoramentoTintim />}
        />
        <Route path="portais" element={<Portais />} />
        <Route
          path="portais/monitoramento/:id?"
          element={<MonitoramentoPortais />}
        />
      </Route>
    </Routes>
  );
}
