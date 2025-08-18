import React from "react";
import Modal from "./Modal";
import Button from "./Button";

interface ViewAllAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Array<{
    kommo_id?: number;
    subdomain: string;
    is_active: boolean;
  }>;
  groupName: string;
  onAddAccount?: () => void;
}

const ViewAllAccountsModal: React.FC<ViewAllAccountsModalProps> = ({
  isOpen,
  onClose,
  accounts,
  groupName,
  onAddAccount,
}) => {
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("pt-BR").format(num);
  };

  const getAccountStatus = (isActive: boolean): string => {
    return isActive ? "Ativa" : "Inativa";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Todas as Contas - ${groupName}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Header com informações */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className="fas fa-users text-2xl text-primary"></i>
            <div>
              <h3 className="text-lg font-semibold text-base-content">
                Contas Escravas
              </h3>
              <p className="text-sm text-base-content opacity-70">
                {accounts.length} conta{accounts.length !== 1 ? "s" : ""}{" "}
                configurada{accounts.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {onAddAccount && (
            <Button variant="primary" onClick={onAddAccount}>
              <i className="fas fa-plus"></i>
              Adicionar Nova Conta
            </Button>
          )}
        </div>

        {/* Lista de contas */}
        {accounts.length === 0 ? (
          <div className="bg-base-200 border-2 border-dashed border-base-300 rounded-xl p-12 text-center">
            <i className="fas fa-inbox text-5xl text-base-content opacity-50 mb-4"></i>
            <h3 className="text-lg font-semibold text-base-content mb-2">
              Nenhuma conta escrava configurada
            </h3>
            <p className="text-base-content opacity-70 mb-6">
              Adicione contas escravas para começar a sincronizar dados.
            </p>
            {onAddAccount && (
              <Button variant="primary" onClick={onAddAccount}>
                <i className="fas fa-plus"></i>
                Adicionar Primeira Conta
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account, index) => (
              <div
                key={account.kommo_id || index}
                className="card bg-base-100 border border-base-300 p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <i className="fas fa-building text-primary-content"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-base-content">
                        {account.subdomain}
                      </h4>
                      {account.kommo_id && (
                        <p className="text-xs text-base-content opacity-70">
                          ID: {formatNumber(account.kommo_id)}
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`badge text-xs font-medium ${
                      account.is_active ? "badge-success" : "badge-error"
                    }`}
                  >
                    {getAccountStatus(account.is_active)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content opacity-70">
                      Status:
                    </span>
                    <span
                      className={`font-medium ${
                        account.is_active ? "text-success" : "text-error"
                      }`}
                    >
                      {getAccountStatus(account.is_active)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-base-content opacity-70">
                      Subdomínio:
                    </span>
                    <span className="font-medium text-base-content">
                      {account.subdomain}.kommo.com
                    </span>
                  </div>
                </div>

                {/* Ações da conta (escondidas se não houver handlers) */}
                {/* Placeholder para futuras ações com condicional */}
              </div>
            ))}
          </div>
        )}

        {/* Estatísticas */}
        {accounts.length > 0 && (
          <div className="bg-base-200 rounded-lg p-4">
            <h4 className="font-medium text-base-content mb-3">Resumo</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {accounts.length}
                </div>
                <div className="text-xs text-base-content opacity-70">
                  Total
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {accounts.filter((acc) => acc.is_active).length}
                </div>
                <div className="text-xs text-base-content opacity-70">
                  Ativas
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-error">
                  {accounts.filter((acc) => !acc.is_active).length}
                </div>
                <div className="text-xs text-base-content opacity-70">
                  Inativas
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {Math.round(
                    (accounts.filter((acc) => acc.is_active).length /
                      accounts.length) *
                      100
                  )}
                  %
                </div>
                <div className="text-xs text-base-content opacity-70">
                  Eficiência
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-base-300">
          <Button variant="secondary" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewAllAccountsModal;
