import React from "react";
import { Group, GroupManagementProps } from "./types";
import { GrUpdate } from "react-icons/gr";

const GroupManagement: React.FC<GroupManagementProps> = ({
  groups,
  selectedGroup,
  onGroupSelect,
  onRefreshGroups,
  onCreateGroup,
  onAddAccount,
  onShowDetails,
  onSyncGroup,
}) => {
  const currentGroup = groups.find((g: { id: any }) => g.id === selectedGroup);

  return (
    <div className="rounded-xl p-5 mb-6 bg-base-300">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        Gerenciamento de Grupos
      </h2>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <label
              htmlFor="groupSelect"
              className="text-base-content font-semibold"
            >
              Grupo Ativo:
            </label>
            <select
              id="groupSelect"
              value={selectedGroup}
              onChange={(e) => onGroupSelect(e.target.value)}
              className="select select-bordered focus:outline-0"
            >
              <option value="">Selecione um grupo...</option>
              {groups.map((group: Group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
            {onRefreshGroups && (
              <button className="btn btn-sm" onClick={onRefreshGroups}>
                <GrUpdate className="text-lg text-base-content" />
              </button>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            {onAddAccount && (
              <button className="btn btn-sm" onClick={onAddAccount}>
                Adicionar Conta
              </button>
            )}
            {onCreateGroup && (
              <button className="btn btn-sm" onClick={() => onCreateGroup()}>
                Novo Grupo
              </button>
            )}
            {onShowDetails && (
              <button
                className={`btn btn-sm ${!selectedGroup ? "btn-disabled" : ""}`}
                onClick={onShowDetails}
                disabled={!selectedGroup}
              >
                Detalhes
              </button>
            )}
            {onSyncGroup && (
              <button
                className={`btn btn-sm ${!selectedGroup ? "btn-disabled" : ""}`}
                onClick={onSyncGroup}
                disabled={!selectedGroup}
              >
                <i className="fas fa-sync"></i>
                Sincronizar Grupo
              </button>
            )}
          </div>
        </div>

        {currentGroup && (
          <div className="bg-base-200 rounded-lg p-4 border border-base-300">
            <div>
              <h3 className="mb-2 text-base-content text-lg">
                {currentGroup.name}
              </h3>
              <p className="opacity-80 mb-3">{currentGroup.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex justify-between items-center p-3 bg-base-100 rounded border border-base-300">
                  <span className="font-medium">Conta Mestre:</span>
                  <span className="font-semibold">
                    {currentGroup.masterAccount}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-base-100 rounded border border-base-300">
                  <span className="font-medium">Contas Escravas:</span>
                  <span className="font-semibold">
                    {currentGroup.slaveAccounts.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupManagement;
