import React, { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (groupData: {
    name: string;
    description: string;
    masterAccountId: string;
  }) => Promise<void>;
  availableAccounts?: Array<{
    id: number;
    subdomain: string;
    is_master?: boolean;
  }>;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  availableAccounts = [],
}) => {
  console.log("CreateGroupModal renderizado - isOpen:", isOpen);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    masterAccountId: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      await onCreate(formData);
      setFormData({ name: "", description: "", masterAccountId: "" });
      onClose();
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
      setErrors({ general: "Erro ao criar grupo. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: "", description: "", masterAccountId: "" });
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Criar Novo Grupo"
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
              onChange={(e) =>
                setFormData({ ...formData, masterAccountId: e.target.value })
              }
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
          <p className="mt-1 text-xs text-base-content opacity-70">
            Conta que servirá como fonte de dados para sincronização
          </p>
        </div>

        {/* Informações Adicionais */}
        <div className="alert alert-info">
          <div className="flex">
            <i className="fas fa-info-circle mr-3"></i>
            <div className="text-sm">
              <p className="font-medium mb-1">Sobre grupos:</p>
              <ul className="text-xs space-y-1">
                <li>• A conta master é a fonte de dados para sincronização</li>
                <li>
                  • Você poderá adicionar contas escravas após criar o grupo
                </li>
                <li>• As contas escravas receberão os dados da conta master</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 pt-4 border-t border-base-300">
          <Button variant="secondary" onClick={handleReset} disabled={loading}>
            <i className="fas fa-undo"></i>
            Limpar
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
                Criando...
              </>
            ) : (
              <>
                <i className="fas fa-plus"></i>
                Criar Grupo
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateGroupModal;
