import React from "react";
import Button from "./Button";
import AccountItem from "./AccountItem";
import { MultiAccountSectionProps } from "./types";

const MultiAccountSection: React.FC<MultiAccountSectionProps> = ({
  accounts,
  onRefresh,
  onSync,
  onAccountAction,
  syncParallel,
  setSyncParallel,
  continueOnError,
  setContinueOnError,
}) => (
  <div className="card bg-base-300 shadow-sm mb-6">
    <div className="card-body">
      <h2 className="card-title text-base-content mb-3 text-lg font-semibold flex items-center gap-2">
        <i className="fas fa-users-cog"></i>
        Gerenciamento de Contas Escravas
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-base-200 p-4 rounded-lg">
          <h3 className="mb-3 text-base-content font-medium">
            Contas Escravas Configuradas:
          </h3>
          <div className="max-h-80 overflow-y-auto">
            {accounts.length === 0 ? (
              <div className="text-center text-base-content opacity-70 py-8">
                Nenhuma conta configurada
              </div>
            ) : (
              accounts.map((account, index) => (
                <AccountItem
                  key={index}
                  account={account}
                  onAction={onAccountAction!}
                />
              ))
            )}
          </div>
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh} icon="fas fa-refresh">
              Atualizar Lista
            </Button>
          )}
        </div>
        <div className="flex flex-col gap-5">
          {onSync && (
            <Button
              variant="primary-large"
              onClick={onSync}
              icon="fas fa-network-wired"
            >
              Sincronizar Todas as Contas
            </Button>
          )}
          {typeof setSyncParallel === "function" &&
            typeof setContinueOnError === "function" && (
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-base-content">
                  <input
                    type="checkbox"
                    checked={syncParallel}
                    onChange={(e) => setSyncParallel(e.target.checked)}
                    className="checkbox"
                  />
                  Sincronização Paralela (mais rápido)
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-base-content">
                  <input
                    type="checkbox"
                    checked={continueOnError}
                    onChange={(e) => setContinueOnError(e.target.checked)}
                    className="checkbox"
                  />
                  Continuar mesmo com erros
                </label>
              </div>
            )}
        </div>
      </div>
    </div>
  </div>
);

export default MultiAccountSection;
