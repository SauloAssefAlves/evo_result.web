import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import { AccountGroup } from "./types";

interface DeleteGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  group: AccountGroup | null;
  loading?: boolean;
}

const DeleteGroupModal: React.FC<DeleteGroupModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  group,
  loading = false,
}) => {
  if (!group) return null;

  const groupName = group.name;
  const masterAccount = group.master_account?.subdomain || "Conta Master";
  const slaveAccountsCount = group.slave_accounts?.length || 0;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Excluir Grupo"
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-error bg-opacity-20 rounded-full flex items-center justify-center">
            <i className="fas fa-exclamation-triangle text-error text-2xl"></i>
          </div>
        </div>

        {/* Warning Message */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-base-content mb-3">
            Atenção! Esta ação é irreversível
          </h3>
          <p className="text-base-content opacity-70">
            Você está prestes a excluir permanentemente o grupo "
            <strong>{groupName}</strong>" e todas as suas contas.
          </p>
        </div>

        {/* Details */}
        <div className="alert alert-error">
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <i className="fas fa-info-circle"></i>O que será excluído:
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <i className="fas fa-crown text-sm"></i>
                <span>
                  Conta Master: <strong>{masterAccount}</strong>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-users text-sm"></i>
                <span>
                  {slaveAccountsCount} conta
                  {slaveAccountsCount !== 1 ? "s" : ""} escrava
                  {slaveAccountsCount !== 1 ? "s" : ""}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-database text-sm"></i>
                <span>Todos os dados de sincronização</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-history text-sm"></i>
                <span>Histórico de logs e estatísticas</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Confirmation Input */}
        <div className="alert alert-warning">
          <div>
            <p className="text-sm">
              <i className="fas fa-lightbulb mr-2"></i>
              <strong>Dica:</strong> Se você deseja apenas pausar as
              sincronizações temporariamente, considere desativar o grupo ao
              invés de excluí-lo.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            <i className="fas fa-times"></i>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Excluindo...
              </>
            ) : (
              <>
                <i className="fas fa-trash"></i>
                Excluir Permanentemente
              </>
            )}
          </Button>
        </div>

        {/* Additional Warning */}
        <div className="text-center">
          <p className="text-xs text-base-content opacity-70">
            Esta ação não pode ser desfeita. Certifique-se de ter backup dos
            dados importantes.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteGroupModal;
