import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import Button from "./Button";
import { apiRequest } from "../../services/syncApi";

interface SlaveAccount {
  id: number;
  subdomain: string;
  status?: string;
  contact_count?: number;
}

interface AddSlaveAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (accountData: {
    subdomain: string;
    refresh_token: string;
  }) => Promise<void>;
  onAssociate: (accountId: number) => Promise<void>;
  groupName?: string;
  groupSlaves?: Array<{
    id: number;
    subdomain: string;
    status?: string;
    contact_count?: number;
  }>;
}

const AddSlaveAccountModal: React.FC<AddSlaveAccountModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  onAssociate,
  groupName,
  groupSlaves,
}) => {
  const [formData, setFormData] = useState({
    subdomain: "",
    refresh_token: "",
  });
  console.log("AQUIO", groupSlaves);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slaveAccounts, setSlaveAccounts] = useState<SlaveAccount[]>([]);
  const [selectedSlaveId, setSelectedSlaveId] = useState<number | null>(null);
  const [fetchingSlaves, setFetchingSlaves] = useState(false);

  // Buscar contas escravas existentes ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      setFetchingSlaves(true);
      apiRequest("/sync/accounts", { method: "GET" })
        .then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            let slaves: SlaveAccount[] = [];
            if (groupName) {
              slaves =
                data.accounts.filter(
                  (acc: { is_master: any }) => !acc.is_master
                ) || [];
            } else {
              slaves =
                data.accounts.filter(
                  (acc: { is_master: any }) => !acc.is_master
                ) || [];
            }
            setSlaveAccounts(slaves);
          } else {
            setSlaveAccounts([]);
          }
        })
        .catch(() => setSlaveAccounts([]))
        .finally(() => setFetchingSlaves(false));
    } else {
      setSlaveAccounts([]);
      setSelectedSlaveId(null);
    }
  }, [isOpen]);

  const handleAssociate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlaveId) return;
    setLoading(true);
    try {
      await onAssociate(selectedSlaveId);
      onClose();
    } catch (error) {
      setErrors({ general: "Erro ao associar conta escrava." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ...existing code...
  };

  const handleReset = () => {
    setFormData({ subdomain: "", refresh_token: "" });
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Adicionar Conta Escrava${groupName ? ` - ${groupName}` : ""}`}
      maxWidth="max-w-lg"
    >
      {fetchingSlaves ? (
        <div className="py-8 text-center">Carregando contas escravas...</div>
      ) : slaveAccounts.filter(
          (acc) => !groupSlaves?.some((slave) => slave.id === acc.id)
        ).length > 0 ? (
        <form onSubmit={handleAssociate} className="space-y-6">
          {errors.general && (
            <div className="alert alert-error">
              <div className="flex">
                <i className="fas fa-exclamation-circle mr-3"></i>
                <p className="text-sm">{errors.general}</p>
              </div>
            </div>
          )}
          <div>
            <label htmlFor="slaveAccount" className="label">
              <span className="label-text text-base-content font-medium">
                Escolha uma conta escrava existente
              </span>
            </label>
            <select
              id="slaveAccount"
              value={selectedSlaveId ?? ""}
              onChange={(e) => setSelectedSlaveId(Number(e.target.value))}
              className="select select-bordered w-full"
              disabled={loading}
            >
              <option value="" disabled>
                Selecione uma conta escrava
              </option>
              {slaveAccounts
                .filter(
                  (acc) => !groupSlaves?.some((slave) => slave.id === acc.id)
                )
                .map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.subdomain} {acc.status ? `(${acc.status})` : ""}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-base-300">
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
              disabled={loading || !selectedSlaveId}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Associando...
                </>
              ) : (
                <>
                  <i className="fas fa-link"></i>
                  Associar Conta
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="py-8 text-center text-base-content opacity-80">
          Nenhuma conta escrava disponível para associação. Adicione uma nova
          conta escrava.
        </div>
      )}
    </Modal>
  );
};

export default AddSlaveAccountModal;
