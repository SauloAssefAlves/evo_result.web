import React from "react";
import { StatCardProps } from "./types";

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <div className="card bg-primary text-primary-content p-5 text-center">
    <h3 className="mb-3 text-lg flex items-center justify-center gap-2">
      <i className={icon}></i>
      {title}
    </h3>
    <div className="text-xl font-semibold">{value}</div>
  </div>
);

export default StatCard;
