import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import Button from "./Button";

interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (groupData: {
    id: string;
    name: string;
    description: string;
    masterAccountId: string;
  }) => Promise<void>;
  groupData?: {
    id: string;
    name: string;
    description: string;
    masterAccountId: string;
    slaveAccounts?: Array<{
      id: number;
      subdomain: string;
      status?: string;
      contact_count?: number;
    }>;
  };
  availableAccounts?: Array<{
    id: number;
    subdomain: string;
    is_master?: boolean;
  }>;
  onRemoveSlaveAccount?: (accountId: number) => Promise<void>;
}

const EditGroupModal: React.FC<EditGroupModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  groupData,
  availableAccounts = [],
  onRemoveSlaveAccount,
}) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    masterAccountId: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [removingAccount, setRemovingAccount] = useState<number | null>(null);
  const [confirmMasterChange, setConfirmMasterChange] = useState(false);
  const [originalMasterAccountId, setOriginalMasterAccountId] = useState("");

  // Preencher formulário quando groupData mudar
  useEffect(() => {
    console.log("EditGroupModal - useEffect triggered");
    console.log("groupData:", groupData);
    console.log("availableAccounts:", availableAccounts);
    console.log("isOpen:", isOpen);

    if (groupData && isOpen) {
      setFormData({
        id: groupData.id,
        name: groupData.name,
        description: groupData.description,
        masterAccountId: groupData.masterAccountId,
      });
      setOriginalMasterAccountId(groupData.masterAccountId);
      setErrors({});
      setConfirmMasterChange(false);
    }
  }, [groupData, isOpen, availableAccounts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar se houve mudança na conta master
    const masterChanged = formData.masterAccountId !== originalMasterAccountId;

    if (masterChanged && !confirmMasterChange) {
      setConfirmMasterChange(true);
      return;
    }

    // Validação básica
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Nome do grupo é obrigatório";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    }
    if (!formData.masterAccountId.trim()) {
      newErrors.masterAccountId = "Conta master é obrigatória";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await onUpdate(formData);
      onClose();
    } catch (error) {
      console.error("Erro ao editar grupo:", error);
      setErrors({ general: "Erro ao editar grupo. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSlaveAccount = async (accountId: number) => {
    if (!onRemoveSlaveAccount) return;

    setRemovingAccount(accountId);
    try {
      await onRemoveSlaveAccount(accountId);
    } catch (error) {
      console.error("Erro ao remover conta escrava:", error);
      setErrors({ general: "Erro ao remover conta escrava. Tente novamente." });
    } finally {
      setRemovingAccount(null);
    }
  };

  const handleMasterAccountChange = (newMasterAccountId: string) => {
    setFormData({ ...formData, masterAccountId: newMasterAccountId });
    if (newMasterAccountId !== originalMasterAccountId && confirmMasterChange) {
      setConfirmMasterChange(false);
    }
  };

  const handleReset = () => {
    if (groupData) {
      setFormData({
        id: groupData.id,
        name: groupData.name,
        description: groupData.description,
        masterAccountId: groupData.masterAccountId,
      });
      setOriginalMasterAccountId(groupData.masterAccountId);
    }
    setErrors({});
    setConfirmMasterChange(false);
  };

  console.log("Available Accounts:", originalMasterAccountId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Grupo"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="alert alert-error">
            <div className="flex">
              <i className="fas fa-exclamation-circle mr-3"></i>
              <p className="text-sm">{errors.general}</p>
            </div>
          </div>
        )}

        {/* ID do Grupo (readonly) */}
        <div>
          <label htmlFor="groupId" className="label">
            <span className="label-text text-base-content font-medium">
              ID do Grupo
            </span>
          </label>
          <input
            type="text"
            id="groupId"
            value={formData.id}
            className="input input-bordered w-full bg-base-200 text-base-content opacity-70"
            disabled
            readOnly
          />
          <p className="mt-1 text-xs text-base-content opacity-70">
            O ID do grupo não pode ser alterado
          </p>
        </div>

        {/* Nome do Grupo */}
        <div>
          <label htmlFor="groupName" className="label">
            <span className="label-text text-base-content font-medium">
              Nome do Grupo *
            </span>
          </label>
          <input
            type="text"
            id="groupName"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`input input-bordered w-full focus:outline-0 ${
              errors.name ? "input-error" : ""
            }`}
            placeholder="Ex: Grupo Principal"
            disabled={loading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-error">{errors.name}</p>
          )}
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="groupDescription" className="label">
            <span className="label-text text-base-content font-medium">
              Descrição *
            </span>
          </label>
          <textarea
            id="groupDescription"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className={`textarea textarea-bordered w-full focus:outline-0 resize-none ${
              errors.description ? "textarea-error" : ""
            }`}
            rows={3}
            placeholder="Descreva o propósito deste grupo..."
            disabled={loading}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-error">{errors.description}</p>
          )}
        </div>

        {/* Conta Master */}
        <div>
          <label htmlFor="masterAccount" className="label">
            <span className="label-text text-base-content font-medium">
              Conta Master *
            </span>
          </label>

          {availableAccounts.length > 0 ? (
            <select
              id="masterAccount"
              value={formData.masterAccountId}
              onChange={(e) => handleMasterAccountChange(e.target.value)}
              className={`select select-bordered w-full focus:outline-0 ${
                errors.masterAccountId ? "select-error" : ""
              }`}
              disabled={loading}
            >
              <option value="">Selecione uma conta master</option>
              {availableAccounts.map((account) => (
                <option key={account.id} value={account.id.toString()}>
                  {account.subdomain} (ID: {account.id})
                </option>
              ))}
            </select>
          ) : (
            <div className="w-full p-3 border-2 border-base-300 rounded-lg bg-base-200">
              <p className="text-base-content opacity-70 text-sm">
                Nenhuma conta disponível. Adicione contas primeiro.
              </p>
            </div>
          )}
          {errors.masterAccountId && (
            <p className="mt-1 text-sm text-error">{errors.masterAccountId}</p>
          )}
          {formData.masterAccountId !== originalMasterAccountId && (
            <div className="mt-2 p-2 bg-warning bg-opacity-20 rounded border-l-4 border-warning">
              <p className="text-xs text-warning-content">
                <i className="fas fa-exclamation-triangle mr-1"></i>
                Você está alterando a conta master. Isso pode afetar
                sincronizações ativas.
              </p>
            </div>
          )}
          <p className="mt-1 text-xs text-base-content opacity-70">
            ⚠️ Alterar a conta master pode afetar as sincronizações existentes
          </p>
        </div>

        {/* Contas Escravas */}
        {groupData?.slaveAccounts && groupData.slaveAccounts.length > 0 && (
          <div>
            <label className="label">
              <span className="label-text text-base-content font-medium">
                Contas Escravas ({groupData.slaveAccounts.length})
              </span>
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-base-300 rounded-lg p-3 bg-base-100">
              {groupData.slaveAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-2 bg-base-200 rounded-md hover:bg-base-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-base-content">
                        {account.subdomain}
                      </p>
                      <p className="text-xs text-base-content opacity-70">
                        ID: {account.id}
                        {account.contact_count &&
                          ` • ${account.contact_count} contatos`}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSlaveAccount(account.id)}
                    disabled={loading || removingAccount === account.id}
                    className="btn btn-sm btn-error btn-outline hover:btn-error"
                    title="Remover conta escrava"
                  >
                    {removingAccount === account.id ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-trash"></i>
                    )}
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-base-content opacity-70">
              <i className="fas fa-info-circle mr-1"></i>
              As contas escravas podem ser removidas individualmente. Para
              adicionar novas contas, use a opção "Adicionar Conta Escrava" na
              visão geral.
            </p>
          </div>
        )}

        {/* Modal de Confirmação para Mudança de Master */}
        {confirmMasterChange && (
          <div className="alert alert-warning">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <i className="fas fa-exclamation-triangle"></i>
                <p className="font-medium text-sm">
                  Confirmar Mudança de Conta Master
                </p>
              </div>
              <p className="text-xs">
                Você está prestes a alterar a conta master deste grupo. Esta
                ação pode:
              </p>
              <ul className="text-xs ml-4 space-y-1">
                <li>• Interromper sincronizações em andamento</li>
                <li>• Afetar configurações de integração</li>
                <li>• Requerer reconfiguração de tokens</li>
              </ul>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setConfirmMasterChange(false)}
                  className="btn btn-sm btn-secondary"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmMasterChange(false);
                    handleSubmit({
                      preventDefault: () => {},
                    } as React.FormEvent);
                  }}
                  className="btn btn-sm btn-warning"
                  disabled={loading}
                >
                  Confirmar Mudança
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Aviso sobre alterações */}
        <div className="alert alert-info">
          <div className="flex">
            <i className="fas fa-info-circle mr-3"></i>
            <div className="text-sm">
              <p className="font-medium mb-1">Informações sobre edição:</p>
              <ul className="text-xs space-y-1">
                <li>
                  • Alterações no nome e descrição são aplicadas imediatamente
                </li>
                <li>• Mudanças na conta master requerem confirmação</li>
                <li>• Contas escravas podem ser removidas individualmente</li>
                <li>
                  • Para adicionar novas contas escravas, use a visão geral do
                  grupo
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 pt-4 border-t border-base-300">
          <Button variant="secondary" onClick={handleReset} disabled={loading}>
            <i className="fas fa-undo"></i>
            Resetar
          </Button>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <button
            type="submit"
            className={`btn font-semibold text-sm transition-all duration-300 inline-flex items-center gap-2 ${
              loading
                ? "btn-disabled"
                : "btn-primary hover:-translate-y-0.5 hover:shadow-lg"
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Salvando...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditGroupModal;
