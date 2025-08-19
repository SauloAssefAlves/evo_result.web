import React from "react";
import StatCard from "./StatCard";
import { StatsSectionProps } from "./types";

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => (
  <div className="card bg-base-300 shadow-xl mb-6">
    <div className="card-body">
      <h2 className="card-title text-base-content mb-5 text-xl flex items-center gap-3">
        <i className="fas fa-chart-bar"></i>
        Estatísticas
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Pipelines"
          value={stats.pipelines}
          icon="fas fa-sitemap"
        />
        <StatCard
          title="Grupos de Campos"
          value={stats.groups}
          icon="fas fa-folder"
        />
        <StatCard
          title="Campos Personalizados"
          value={stats.fields}
          icon="fas fa-tags"
        />
        <StatCard title="Tempo Total" value={stats.time} icon="fas fa-clock" />
      </div>
    </div>
  </div>
);

export default StatsSection;
