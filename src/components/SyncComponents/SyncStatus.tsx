import React from "react";
import { SyncStatusProps } from "./types";

const SyncStatus: React.FC<SyncStatusProps> = ({
  status,
  progress,
  currentOperation,
  currentBatch,
  estimatedTime,
}) => (
  <div className="card bg-base-300 shadow-sm mb-6">
    <div className="card-body">
      <h2 className="card-title text-base-content mb-3 text-lg flex items-center gap-2">
        <i className="fas fa-chart-line"></i>
        Status da Sincronização
      </h2>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center py-3 px-3 bg-base-200 rounded">
          <span className="font-semibold text-base-content">Status:</span>
          <span className="text-base-content font-medium">{status}</span>
        </div>
        <div className="flex justify-between items-center py-3 px-3 bg-base-200 rounded">
          <span className="font-semibold text-base-content">Progresso:</span>
          <div className="flex items-center gap-3 flex-1 max-w-80">
            <div className="flex-1 h-3 bg-base-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-primary transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="font-semibold text-base-content min-w-12">
              {progress}%
            </span>
          </div>
        </div>
        {currentOperation && (
          <div className="flex justify-between items-center py-3 px-3 bg-base-200 rounded">
            <span className="font-semibold text-base-content">
              Operação Atual:
            </span>
            <span className="text-base-content font-medium">
              {currentOperation}
            </span>
          </div>
        )}
        {currentBatch && (
          <div className="flex justify-between items-center py-3 px-3 bg-base-200 rounded">
            <span className="font-semibold text-base-content">Contexto:</span>
            <span className="text-base-content font-medium">
              {currentBatch}
            </span>
          </div>
        )}
        {estimatedTime && (
          <div className="flex justify-between items-center py-3 px-3 bg-base-200 rounded">
            <span className="font-semibold text-base-content">
              Tempo Estimado:
            </span>
            <span className="text-base-content font-medium">
              {estimatedTime}
            </span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default SyncStatus;
