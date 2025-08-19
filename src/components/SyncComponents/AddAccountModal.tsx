import React, { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (accountData: {
    subdomain: string;
    refresh_token: string;
    is_master: boolean;
  }) => Promise<void>;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState({
    subdomain: "",
    refresh_token: "",
    is_master: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    const newErrors: Record<string, string> = {};
    if (!formData.subdomain.trim()) {
      newErrors.subdomain = "Subdomínio é obrigatório";
    }
    if (!formData.refresh_token.trim()) {
      newErrors.refresh_token = "Refresh Token é obrigatório";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await onAdd(formData);

      // Reset form
      setFormData({
        subdomain: "",
        refresh_token: "",
        is_master: false,
      });

      onClose();
    } catch (error) {
      console.error("Erro ao adicionar conta:", error);
      setErrors({
        general:
          error instanceof Error ? error.message : "Erro ao adicionar conta",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Nova Conta">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="alert alert-error">{errors.general}</div>
        )}

        {/* Subdomínio */}
        <div>
          <label className="label">
            <span className="label-text text-base-content font-medium">
              Subdomínio *
            </span>
          </label>
          <input
            type="text"
            value={formData.subdomain}
            onChange={(e) => handleInputChange("subdomain", e.target.value)}
            placeholder="exemplo-empresa"
            className={`input input-bordered w-full focus:outline-0 ${
              errors.subdomain ? "input-error" : ""
            }`}
          />
          {errors.subdomain && (
            <p className="mt-1 text-sm text-error">{errors.subdomain}</p>
          )}
          <p className="mt-1 text-xs text-base-content opacity-70">
            O nome do subdomínio da conta Kommo (sem .kommo.com)
          </p>
        </div>

        {/* Tipo de Conta */}
        <div>
          <label className="label">
            <span className="label-text text-base-content font-medium">
              Tipo de Conta *
            </span>
          </label>
          <select
            value={formData.is_master ? "master" : "slave"}
            onChange={(e) =>
              handleInputChange("is_master", e.target.value === "master")
            }
            className="select select-bordered w-full focus:outline-0"
          >
            <option value="slave">Escrava</option>
            <option value="master">Master</option>
          </select>
          <p className="mt-1 text-xs text-base-content opacity-70">
            Contas master podem ser origem de dados, escravas recebem os dados
          </p>
        </div>

        {/* Refresh Token */}
        <div>
          <label className="label">
            <span className="label-text text-base-content font-medium">
              Refresh Token *
            </span>
          </label>
          <textarea
            value={formData.refresh_token}
            onChange={(e) => handleInputChange("refresh_token", e.target.value)}
            placeholder="def502008f0c1e..."
            rows={4}
            className={`textarea textarea-bordered w-full focus:outline-0 resize-none ${
              errors.refresh_token ? "textarea-error" : ""
            }`}
          />
          {errors.refresh_token && (
            <p className="mt-1 text-sm text-error">{errors.refresh_token}</p>
          )}
          <p className="mt-1 text-xs text-base-content opacity-70">
            Token obtido através da integração OAuth2 do Kommo
          </p>
        </div>

        {/* Botões */}
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
          <button
            type="submit"
            disabled={loading}
            className={`btn flex-1 ${
              loading ? "btn-disabled" : "btn-primary"
            } flex items-center justify-center gap-2`}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Adicionando...
              </>
            ) : (
              <>
                <i className="fas fa-plus"></i>
                Adicionar Conta
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAccountModal;
