import React from "react";
import { AccountsOverviewProps, SlaveAccount, AccountGroup } from "./types";

const AccountsOverview: React.FC<AccountsOverviewProps> = ({
  accounts,
  onRefresh,
  onToggleViewMode,
  viewMode,
  onAddSlaveAccount,
  onViewAllAccounts,
  onEditGroup,
  onSyncGroup,
  onDeleteGroup,
}) => {
  // Função para formatar data da última sincronização
  const formatLastSync = (lastSync?: { completed_at: string }) => {
    if (!lastSync?.completed_at) return "Nunca";

    const syncDate = new Date(lastSync.completed_at);
    const now = new Date();
    const diffHours = (now.getTime() - syncDate.getTime()) / (1000 * 60 * 60);

    if (diffHours < 1) return "Recente";
    if (diffHours < 24) return `${Math.floor(diffHours)}h atrás`;

    return syncDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Função para formatar números
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  // Função para obter status da conta
  const getAccountStatus = (account: SlaveAccount) => {
    if (account.status === "inactive") return "Inativa";
    if (!account.last_sync) return "Nunca sincronizado";

    const lastSync = new Date(account.last_sync);
    const now = new Date();
    const diffHours = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);

    if (diffHours < 1) return "Recente";
    if (diffHours < 24) return `${Math.floor(diffHours)}h atrás`;
    if (diffHours < 168) return `${Math.floor(diffHours / 24)}d atrás`;
    return "Desatualizado";
  };

  // Função para renderizar item de conta escrava
  const renderSlaveAccountItem = (slave: SlaveAccount) => {
    const status = getAccountStatus(slave);
    const contactCount = slave.contact_count || 0;

    return (
      <div
        key={slave.id}
        className="bg-primary-content bg-opacity-10 border border-primary-content border-opacity-20 rounded-lg p-3 transition-colors duration-300 hover:bg-primary-content hover:bg-opacity-15"
      >
        <div className="font-medium mb-1 flex items-center gap-2">
          <i className="fas fa-user"></i>
          {slave.subdomain}
        </div>
        <div className="text-sm opacity-80">
          {formatNumber(contactCount)} contatos
        </div>
        <div className="text-sm opacity-80">Status: {status}</div>
      </div>
    );
  };

  return (
    <div className="card bg-base-300 shadow-sm rounded-2xl p-6 mb-6">
      <h2 className="card-title text-2xl mb-5 flex items-center gap-3">
        <i className="fas fa-network-wired"></i>
        Visão Geral de Contas
      </h2>
      <div className="flex flex-col gap-5">
        <div className="flex gap-3 flex-wrap">
          <button className="btn btn-neutral" onClick={onRefresh}>
            <i className="fas fa-refresh"></i>
            Atualizar Visão Geral
          </button>
          <button className="btn btn-neutral" onClick={onToggleViewMode}>
            <i className="fas fa-exchange-alt"></i>
            <span>
              {viewMode === "expanded" ? "Modo Compacto" : "Modo Expandido"}
            </span>
          </button>
        </div>
        <div
          className={`grid gap-5 ${
            viewMode === "expanded"
              ? "grid-cols-1"
              : "grid-cols-1 lg:grid-cols-2"
          }`}
        >
          {accounts.length === 0 ? (
            <div className="card bg-base-200 shadow-sm border-2 border-dashed border-base-300 rounded-xl p-8 text-center">
              <p className="text-base-content opacity-70 font-semibold">
                Nenhuma conta configurada
              </p>
            </div>
          ) : (
            accounts.map((group: AccountGroup) => {
              const masterAccount = group.master_account;
              const slaveAccounts = group.slave_accounts || [];
              const totalContacts = group.total_contacts || 0;
              const lastSync = formatLastSync(group.last_sync);

              return (
                <div
                  key={group.id}
                  className="card bg-primary text-primary-content shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
                >
                  <div className="card-body p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3 text-xl font-semibold">
                        <i className="fas fa-crown"></i>
                        <span>
                          {masterAccount
                            ? masterAccount.subdomain
                            : "Conta não definida"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="badge badge-neutral">
                          {masterAccount && group.is_active
                            ? "Ativa"
                            : "Inativa"}
                        </div>
                        {/* Menu de ações */}
                        <div className="dropdown dropdown-end">
                          <label tabIndex={0} className="btn btn-sm btn-ghost">
                            <i className="fas fa-ellipsis-v"></i>
                          </label>
                          <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                            <li>
                              <button
                                onClick={() =>
                                  onSyncGroup?.(group.id.toString())
                                }
                                className="text-success"
                              >
                                <i className="fas fa-sync"></i>
                                Sincronizar Grupo
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => onEditGroup?.(group)}
                                className="text-info"
                              >
                                <i className="fas fa-edit"></i>
                                Editar Grupo
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => onDeleteGroup?.(group)}
                                className="text-error"
                              >
                                <i className="fas fa-trash"></i>
                                Excluir Grupo
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                      <div className="bg-primary-content bg-opacity-20 p-3 rounded-lg text-center">
                        <div className="text-xs opacity-80 mb-1">Grupo</div>
                        <div className="text-lg font-semibold">
                          {group.name}
                        </div>
                      </div>
                      <div className="bg-primary-content bg-opacity-20 p-3 rounded-lg text-center">
                        <div className="text-xs opacity-80 mb-1">
                          Contas Escravas
                        </div>
                        <div className="text-lg font-semibold">
                          {slaveAccounts.length}
                        </div>
                      </div>
                      <div className="bg-primary-content bg-opacity-20 p-3 rounded-lg text-center">
                        <div className="text-xs opacity-80 mb-1">
                          Total Contatos
                        </div>
                        <div className="text-lg font-semibold">
                          {formatNumber(totalContacts)}
                        </div>
                      </div>
                      <div className="bg-primary-content bg-opacity-20 p-3 rounded-lg text-center">
                        <div className="text-xs opacity-80 mb-1">
                          Última Sync
                        </div>
                        <div className="text-lg font-semibold">{lastSync}</div>
                      </div>
                    </div>

                    {slaveAccounts.length > 0 ? (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-3 pb-3 border-b border-primary-content border-opacity-20">
                          <div className="text-lg font-medium flex items-center gap-2">
                            <i className="fas fa-users"></i>
                            Contas Escravas
                            <span className="badge badge-neutral badge-sm">
                              {slaveAccounts.length}
                            </span>
                          </div>
                          {slaveAccounts.length > 4 && (
                            <button
                              className="btn btn-sm btn-outline btn-accent"
                              onClick={() => {
                                if (onViewAllAccounts) {
                                  onViewAllAccounts(slaveAccounts, group.name);
                                }
                              }}
                            >
                              <i className="fas fa-expand"></i> Ver todas
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {slaveAccounts
                            .slice(0, 4)
                            .map((slave) => renderSlaveAccountItem(slave))}
                          {slaveAccounts.length > 4 && (
                            <div className="bg-primary-content bg-opacity-5 border-2 border-dashed border-primary-content border-opacity-30 rounded-lg p-3 flex items-center justify-center min-h-20 cursor-pointer transition-all duration-300 hover:bg-primary-content hover:bg-opacity-10 hover:border-opacity-50">
                              <div className="text-center flex flex-col items-center gap-1">
                                <i className="fas fa-plus-circle text-xl opacity-70"></i>
                                <div className="text-sm font-medium opacity-80">
                                  +{slaveAccounts.length - 4} contas
                                </div>
                                <button
                                  className="btn btn-ghost btn-xs underline"
                                  onClick={() => {
                                    if (onViewAllAccounts) {
                                      onViewAllAccounts(
                                        slaveAccounts,
                                        group.name
                                      );
                                    }
                                  }}
                                >
                                  Ver todas
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <div className="text-center py-10 opacity-80 italic">
                          <i className="fas fa-info-circle mr-2"></i>
                          Nenhuma conta escrava adicionada ainda
                          <br />
                          <button
                            className="btn btn-accent btn-sm mt-3"
                            onClick={() => {
                              if (onAddSlaveAccount) {
                                onAddSlaveAccount(
                                  group.id.toString(),
                                  group.name
                                );
                              }
                            }}
                          >
                            <i className="fas fa-plus"></i> Adicionar Primeira
                            Conta
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountsOverview;
