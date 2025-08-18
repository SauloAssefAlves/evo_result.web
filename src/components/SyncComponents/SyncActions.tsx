import React from "react";
import { SyncActionsProps } from "./types";

const SyncActions: React.FC<SyncActionsProps> = ({
  onSync,
  onStop,
  syncInProgress,
  disabled = false,
  showFull = true,
  showPipelines = true,
  showCustomFields = true,
  showFieldGroups = true,
  showRequiredStatuses = true,
  showRoles = true,
}) => (
  <div className="card bg-base-300 shadow-sm mb-6">
    <div className="card-body">
      <h2 className="card-title text-base-content mb-3 text-lg flex items-center gap-2">
        <i className="fas fa-play"></i>
        Ações de Sincronização
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {showFull && (
          <button
            className={`btn font-semibold text-sm transition-all duration-300 inline-flex items-center gap-2 m-1 ${
              syncInProgress || disabled
                ? "btn-disabled opacity-60"
                : "btn-primary hover:-translate-y-0.5 hover:shadow-lg"
            }`}
            onClick={() => onSync("full")}
            disabled={syncInProgress || disabled}
            title={disabled ? "Selecione um grupo para sincronizar" : ""}
          >
            <i className="fas fa-sync-alt"></i>
            Sincronizar Grupo
          </button>
        )}
        {showPipelines && (
          <button
            className={`btn font-semibold text-sm transition-all duration-300 inline-flex items-center gap-2 m-1 ${
              syncInProgress || disabled
                ? "btn-disabled opacity-60"
                : "btn-primary hover:-translate-y-0.5 hover:shadow-lg"
            }`}
            onClick={() => onSync("pipelines")}
            disabled={syncInProgress || disabled}
            title={disabled ? "Selecione um grupo para sincronizar" : ""}
          >
            <i className="fas fa-sitemap"></i>
            Sincronizar Pipelines
          </button>
        )}

        {showCustomFields && (
          <button
            className={`btn font-semibold text-sm transition-all duration-300 inline-flex items-center gap-2 m-1 ${
              syncInProgress || disabled
                ? "btn-disabled opacity-60"
                : "btn-primary hover:-translate-y-0.5 hover:shadow-lg"
            }`}
            onClick={() => onSync("custom_fields")}
            disabled={syncInProgress || disabled}
            title={disabled ? "Selecione um grupo para sincronizar" : ""}
          >
            <i className="fas fa-tags"></i>
            Sincronizar Campos
          </button>
        )}
        {showFieldGroups && (
          <button
            className={`btn font-semibold text-sm transition-all duration-300 inline-flex items-center gap-2 m-1 ${
              syncInProgress || disabled
                ? "btn-disabled opacity-60"
                : "btn-primary hover:-translate-y-0.5 hover:shadow-lg"
            }`}
            onClick={() => onSync("field_groups")}
            disabled={syncInProgress || disabled}
            title={disabled ? "Selecione um grupo para sincronizar" : ""}
          >
            <i className="fas fa-folder"></i>
            Sincronizar Grupo dos Campos
          </button>
        )}
        {showRequiredStatuses && (
          <button
            className={`btn font-semibold text-sm transition-all duration-300 inline-flex items-center gap-2 m-1 ${
              syncInProgress || disabled
                ? "btn-disabled opacity-60"
                : "btn-primary hover:-translate-y-0.5 hover:shadow-lg"
            }`}
            onClick={() => onSync("required_statuses")}
            disabled={syncInProgress || disabled}
            title={disabled ? "Selecione um grupo para sincronizar" : ""}
          >
            <i className="fas fa-exclamation-triangle"></i>
            Sincronizar Required Status
          </button>
        )}
        {showRoles && (
          <button
            className={`btn font-semibold text-sm transition-all duration-300 inline-flex items-center gap-2 m-1 ${
              syncInProgress || disabled
                ? "btn-disabled opacity-60"
                : "btn-primary hover:-translate-y-0.5 hover:shadow-lg"
            }`}
            onClick={() => onSync("roles")}
            disabled={syncInProgress || disabled}
            title={disabled ? "Selecione um grupo para sincronizar" : ""}
          >
            <i className="fas fa-user-shield"></i>
            Sincronizar User Roles
          </button>
        )}
        {syncInProgress && (
          <button
            className="btn btn-error font-semibold text-sm transition-all duration-300 inline-flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-lg m-1"
            onClick={onStop}
          >
            <i className="fas fa-stop"></i>
            Parar Sincronização
          </button>
        )}
      </div>
    </div>
  </div>
);

export default SyncActions;
