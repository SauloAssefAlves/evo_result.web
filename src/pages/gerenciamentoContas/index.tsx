import React, { useState, useCallback } from "react";
import {
  AccountsOverview,
  AddAccountModal,
  AddSlaveAccountModal,
  CreateGroupModal,
  DeleteGroupModal,
  EditGroupModal,
  GroupManagement,
  Modal,
  MultiAccountSection,
  StatsSection,
  SyncActions,
  SyncStatus,
  ViewAllAccountsModal,
} from "../../components/SyncComponents";
import {
  Account,
  Stats,
  Group,
  AccountGroup,
} from "../../components/SyncComponents/types";
import { apiRequest } from "../../services/syncApi";

export default function GerenciamentoContas() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalAccounts: 0,
    syncing: 0,
    completed: 0,
    errors: 0,
    pipelines: 0,
    groups: 0,
    fields: 0,
    time: "0:00",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [syncParallel, setSyncParallel] = useState<boolean>(false);
  const [continueOnError, setContinueOnError] = useState<boolean>(true);
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(
    new Set()
  );
  // Novos estados para funcionalidades completas
  const [groups, setGroups] = useState<Group[]>([]);
  const [accountGroups, setAccountGroups] = useState<AccountGroup[]>([]);
  const [slaveAccounts, setSlaveAccounts] = useState<Account[]>([]);
  const [availableAccounts, setAvailableAccounts] = useState<
    Array<{
      id: number;
      subdomain: string;
      is_master?: boolean;
    }>
  >([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedGroupForSync, setSelectedGroupForSync] = useState<string>("");
  const [viewMode, setViewMode] = useState<"expanded" | "compact">("compact");
  const [syncProgress, setSyncProgress] = useState<number>(0);
  // Estados para modais
  const [modals, setModals] = useState({
    addSlaveAccount: false,
    createGroup: false,
    addAccount: false,
    viewAllAccounts: false,
    deleteGroup: false,
    editGroup: false,
  });
  const [modalData, setModalData] = useState<{
    selectedGroupForAccount?: string;
    selectedGroupAccounts?: any[];
    selectedGroupName?: string;
    groupToEdit?: {
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
    groupSlaves?: Array<{
      id: number;
      subdomain: string;
      status?: string;
      contact_count?: number;
    }>;
  }>({});
  // Estado adicional para o modal de exclusão
  const [groupToDelete, setGroupToDelete] = useState<AccountGroup | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentOperation, setCurrentOperation] =
    useState<string>("Aguardando");
  const [currentBatch, setCurrentBatch] = useState<string>("-");
  const [estimatedTime] = useState<string>("-");

  // Estados para gerenciamento de erros
  const [errorNotification, setErrorNotification] = useState<{
    show: boolean;
    title: string;
    message: string;
    details?: string;
  }>({
    show: false,
    title: "",
    message: "",
    details: "",
  });

  const loadAccountGroups = useCallback(async () => {
    setLoading(true);
    try {
      // Carregamento da API de grupos com informações detalhadas incluindo slave accounts
      const response = await apiRequest("/groups/overview");
      if (response.ok) {
        const responseData = await response.json();

        // Os dados já vêm no formato correto da API
        const groupsData: AccountGroup[] = responseData.groups || [];

        setAccountGroups(groupsData);
        // Atualizar contas escravas quando os grupos são carregados
        setSlaveAccounts(getSlaveAccountsFromGroups(groupsData));
        addLog(
          `${groupsData.length} grupos carregados com detalhes e contas escravas`
        );
      } else {
        let errorMessage = "Falha ao carregar grupos da API";
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (parseError) {
          errorMessage = `Status HTTP: ${response.status} - ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      showError(
        "Erro ao Carregar Grupos",
        "Não foi possível carregar os grupos de contas:",
        errorMessage
      );
      setAccountGroups([]);
    } finally {
      setLoading(false);
    }
  }, []);
  const loadAvailableAccounts = useCallback(async () => {
    try {
      const response = await apiRequest("/sync/accounts");
      if (response.ok) {
        const responseData = await response.json();
        console.log("available accounts loaded:", responseData.accounts);
        console.log(
          "master accounts:",
          responseData.accounts?.filter((acc: any) => acc.is_master)
        );
        setAvailableAccounts(responseData.accounts || []);
        addLog(
          `${responseData.accounts?.length || 0} contas disponíveis carregadas`
        );
      } else {
        let errorMessage = "Falha ao carregar contas disponíveis";
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (parseError) {
          errorMessage = `Status HTTP: ${response.status} - ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      showError(
        "Erro ao Carregar Contas",
        "Não foi possível carregar as contas disponíveis:",
        errorMessage
      );
      setAvailableAccounts([]);
    }
  }, []);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    try {
      // Carregamento da API
      const response = await apiRequest("/sync/accounts");
      if (response.ok) {
        const responseData = await response.json();

        // Mapear os dados da API para o formato esperado pelo React
        const accountsData: Account[] = responseData.accounts.map(
          (account: any) => ({
            id: account.id,
            subdomain: account.subdomain,
            is_master: account.is_master,
            created_at: account.created_at,
            updated_at: account.updated_at,
          })
        );

        setAccounts(accountsData);
        console.log("asasa", accountsData);
        updateStats(accountsData);
        addLog(`${responseData.total} contas carregadas da API`);
      } else {
        throw new Error("Falha ao carregar contas da API");
      }
    } catch (error) {
      console.error("Erro ao carregar contas:", error);
      addLog("Erro ao carregar contas da API");
      setAccounts([]);
      updateStats([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStats = (accountsList: Account[]) => {
    const newStats: Stats = {
      totalAccounts: slaveAccounts.length, // Usar apenas contas escravas
      syncing: 0, // Será atualizado via outras formas
      completed: 0, // Será atualizado via outras formas
      errors: 0, // Será atualizado via outras formas
      pipelines: 0,
      groups: accountGroups.length,
      fields: 0,
      time: "0:00",
    };
    setStats(newStats);
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${message}`);
  };

  // Função para mostrar notificações de erro
  const showError = (title: string, message: string, details?: string) => {
    setErrorNotification({
      show: true,
      title,
      message,
      details,
    });
    // Log do erro também
    addLog(`❌ ERRO: ${title} - ${message}`);
    if (details) {
      addLog(`📋 Detalhes: ${details}`);
    }
  };

  // Função para fechar notificação de erro
  const hideError = () => {
    setErrorNotification({
      show: false,
      title: "",
      message: "",
      details: "",
    });
  };

  // Função de teste para demonstrar erro
  const testError = () => {
    showError(
      "Erro de Teste",
      "Este é um exemplo de como os erros são exibidos no sistema:",
      "Erro simulado: Campo monetário requer parâmetro 'currency' - FieldMissing: This field is missing."
    );
  };

  // Função de teste para demonstrar logs diferentes
  const testLogs = () => {
    addLog("🚀 Iniciando teste de logs...");
    setTimeout(() => addLog("✅ Conexão com API estabelecida"), 500);
    setTimeout(() => addLog("📋 Carregando grupos de contas"), 1000);
    setTimeout(
      () => addLog("⚠️ WARNING: Conta sem configuração de moeda"),
      1500
    );
    setTimeout(() => addLog("✅ 5 contas sincronizadas com sucesso"), 2000);
    setTimeout(
      () => addLog("❌ ERRO: Falha na sincronização da conta teste"),
      2500
    );
    setTimeout(
      () =>
        addLog("📋 Detalhes: FieldMissing currency - This field is missing"),
      3000
    );
    setTimeout(
      () => addLog("✅ Sincronização completa: 4 sucessos, 1 falha"),
      3500
    );
  };

  // Função para extrair todas as contas escravas dos grupos
  const getSlaveAccountsFromGroups = (groups: AccountGroup[]): Account[] => {
    const slaveAccounts: Account[] = [];

    groups.forEach((group) => {
      if (group.slave_accounts && group.slave_accounts.length > 0) {
        group.slave_accounts.forEach((slaveAccount) => {
          slaveAccounts.push({
            id: slaveAccount.id,
            subdomain: slaveAccount.subdomain,
            is_master: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            info: (
              <div className="text-xs">
                <p className="font-medium">Grupo: {group.name}</p>
                {slaveAccount.contact_count && (
                  <p className="opacity-70">
                    {slaveAccount.contact_count} contatos
                  </p>
                )}
                <p className="opacity-60">
                  Status: {slaveAccount.status || "Ativa"}
                </p>
              </div>
            ),
            status: slaveAccount.status || "active",
          });
        });
      }
    });

    return slaveAccounts;
  };

  // Função para extrair todas as contas escravas dos grupos atuais
  const getSlaveAccounts = (): Account[] => {
    return getSlaveAccountsFromGroups(accountGroups);
  };

  const syncAccount = async (accountId: number) => {
    // Remover referências ao status que não existe mais na interface Account
    try {
      const response = await apiRequest(`/sync/account/${accountId}`, {
        method: "POST",
      });

      if (response.ok) {
        addLog(`Sincronização da conta ${accountId} concluída`);
      } else {
        throw new Error("Erro na sincronização");
      }
    } catch (error) {
      addLog(`Erro na sincronização da conta ${accountId}`);
    }
  };

  const syncAllAccounts = async () => {
    addLog("Iniciando sincronização em lote...");
    for (const account of accounts) {
      await syncAccount(account.id);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    addLog("Sincronização em lote concluída");
  };

  const syncSelectedAccounts = async () => {
    addLog("Iniciando sincronização das contas selecionadas...");
    const selectedAccountsList = accounts.filter((acc) =>
      selectedAccounts.has(acc.id.toString())
    );

    for (const account of selectedAccountsList) {
      await syncAccount(account.id);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    addLog("Sincronização das contas selecionadas concluída");
  };

  const toggleAccountSelection = (accountId: string) => {
    setSelectedAccounts((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(accountId)) {
        newSelection.delete(accountId);
      } else {
        newSelection.add(accountId);
      }
      return newSelection;
    });
  };

  const refreshAccountsOverview = () => {
    addLog("Atualizando visão geral de contas...");
    loadAccounts();
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "expanded" ? "compact" : "expanded"));
    addLog(
      `Modo de visualização alterado para ${
        viewMode === "expanded" ? "compacto" : "expandido"
      }`
    );
  };

  const refreshGroups = async () => {
    addLog("Carregando grupos...");
    try {
      const response = await apiRequest("/groups/");
      if (response.ok) {
        const responseData = await response.json();
        setGroups(responseData.groups || []);
        addLog(`${responseData.groups?.length || 0} grupos carregados`);
      } else {
        throw new Error("Falha ao carregar grupos");
      }
    } catch (error) {
      console.error("Erro ao carregar grupos:", error);
      addLog("Erro ao carregar grupos");
      setGroups([]);
    }
  };

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroup(groupId);
    const group = groups.find((g) => g.id === groupId);
    if (group) {
      addLog(`Grupo selecionado: ${group.name}`);
    }
  };

  const handleCreateGroup = () => {
    console.log("handleCreateGroup chamado - estado atual dos modals:", modals);

    // Carregar contas disponíveis antes de abrir o modal
    loadAvailableAccounts();

    setModals((prev) => {
      const newModals = { ...prev, createGroup: true };
      console.log("Novo estado dos modais:", newModals);
      return newModals;
    });
    addLog("Abrindo modal para criar novo grupo...");
    console.log("Log adicionado, função concluída");
  };

  // Funções para adição de contas
  const handleAddAccount = () => {
    setModals({ ...modals, addAccount: true });
    addLog("Abrindo modal de adição de conta");
  };

  const handleAddAccountSubmit = async (accountData: {
    subdomain: string;
    refresh_token: string;
    is_master: boolean;
  }) => {
    try {
      addLog(`Adicionando conta: ${accountData.subdomain}`);

      const response = await apiRequest("/sync/accounts", {
        method: "POST",
        body: JSON.stringify(accountData),
      });

      if (response.ok) {
        const result = await response.json();
        addLog(`Conta ${accountData.subdomain} adicionada com sucesso`);

        // Recarregar dados
        await Promise.all([loadAccountGroups(), loadAvailableAccounts()]);

        // Fechar modal
        setModals((prev) => ({ ...prev, addAccount: false }));
      } else {
        let errorMessage = "Erro ao adicionar conta";
        let errorDetails = "";

        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
          if (errorData.details) {
            errorDetails = errorData.details;
          }
        } catch (parseError) {
          errorDetails = `Status HTTP: ${response.status} - ${response.statusText}`;
        }

        throw new Error(
          errorMessage + (errorDetails ? ` (${errorDetails})` : "")
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      showError(
        "Erro ao Adicionar Conta",
        `Não foi possível adicionar a conta ${accountData.subdomain}:`,
        errorMessage
      );
      throw error;
    }
  };

  const handleShowGroupDetails = () => {
    const group = groups.find((g) => g.id === selectedGroup);
    if (group) {
      addLog(`Mostrando detalhes do grupo: ${group.name}`);
    }
  };

  const handleSyncGroup = async () => {
    const group = groups.find((g) => g.id === selectedGroup);
    if (group) {
      addLog(`Sincronizando grupo: ${group.name}`);
      setCurrentOperation(`Sincronizando grupo ${group.name}`);
      // Implementar lógica de sincronização do grupo
    }
  };

  // Funções para gerenciar modais
  const openAddSlaveAccountModal = (
    groupId: string,
    groupName: string,
    groupSlaves: any[]
  ) => {
    setModalData({
      selectedGroupForAccount: groupId,
      selectedGroupName: groupName,
      groupSlaves,
    });
    setModals({ ...modals, addSlaveAccount: true });
  };

  const openViewAllAccountsModal = (
    groupAccounts: any[],
    groupName: string
  ) => {
    setModalData({
      selectedGroupAccounts: groupAccounts,
      selectedGroupName: groupName,
    });
    setModals({ ...modals, viewAllAccounts: true });
  };

  const closeModal = (modalName: keyof typeof modals) => {
    setModals({ ...modals, [modalName]: false });
    setModalData({});
  };

  // Funções para ações dos modais
  const handleCreateGroupSubmit = async (groupData: {
    name: string;
    description: string;
    masterAccountId: string;
  }) => {
    try {
      addLog(`Criando grupo: ${groupData.name}`);

      // Fazer chamada real para a API
      const response = await apiRequest("/groups/", {
        method: "POST",
        body: JSON.stringify({
          name: groupData.name,
          description: groupData.description,
          master_account_id: parseInt(groupData.masterAccountId),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        addLog(`Grupo "${groupData.name}" criado com sucesso`);

        // Recarregar ambos os dados: grupos para o select e overview para os cards
        await Promise.all([
          refreshGroups(),
          loadAccountGroups(),
          loadAvailableAccounts(),
        ]);

        // Fechar modal
        setModals((prev) => ({ ...prev, createGroup: false }));
      } else {
        let errorMessage = "Erro ao criar grupo";
        let errorDetails = "";

        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
          if (errorData.details) {
            errorDetails = errorData.details;
          }
        } catch (parseError) {
          errorDetails = `Status HTTP: ${response.status} - ${response.statusText}`;
        }

        throw new Error(
          errorMessage + (errorDetails ? ` (${errorDetails})` : "")
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      showError(
        "Erro ao Criar Grupo",
        `Não foi possível criar o grupo "${groupData.name}":`,
        errorMessage
      );
      throw error;
    }
  };

  const handleAddSlaveAccountSubmit = async (accountData: {
    subdomain: string;
    refresh_token: string;
  }) => {
    try {
      addLog(`Adicionando conta escrava: ${accountData.subdomain}`);

      // Chamada real para a API
      const response = await apiRequest("/sync/accounts", {
        method: "POST",
        body: JSON.stringify({
          subdomain: accountData.subdomain,
          refresh_token: accountData.refresh_token,
          is_master: false, // Importante: marcar como conta escrava
          group_id: modalData.selectedGroupForAccount, // Associar ao grupo
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Erro ao adicionar conta");
      }

      addLog(
        `✅ Conta escrava ${accountData.subdomain} adicionada com sucesso ao grupo ${modalData.selectedGroupName}`
      );

      // Recarregar dados dos grupos e contas
      loadAccountGroups();
      loadAvailableAccounts();
    } catch (error) {
      console.error("Erro ao adicionar conta escrava:", error);
      addLog(`❌ Erro ao adicionar conta escrava: ${error}`);
      throw error;
    }
  };

  // Funções para edição de grupo
  const handleEditGroup = async (group: AccountGroup) => {
    // Carregar contas disponíveis antes de abrir o modal
    await loadAvailableAccounts();

    const masterAccountId = group.master_account
      ? group.master_account.id.toString()
      : "";

    console.log("Group to edit:", group);
    console.log("Master account ID:", masterAccountId);
    console.log("Available accountsSSSS:", availableAccounts);

    setModalData({
      groupToEdit: {
        id: group.id.toString(),
        name: group.name,
        description: group.description || "",
        masterAccountId: masterAccountId,
        slaveAccounts:
          group.slave_accounts?.map((account) => ({
            id: account.id,
            subdomain: account.subdomain,
            status: account.status,
            contact_count: account.contact_count,
          })) || [],
      },
    });
    setModals((prev) => ({ ...prev, editGroup: true }));
    addLog(`Editando grupo: ${group.name}`);
  };

  const handleRemoveSlaveAccount = async (accountId: number) => {
    try {
      addLog(`Removendo conta escrava ID: ${accountId}`);

      const response = await apiRequest(`/sync/accounts/${accountId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        addLog(`Conta escrava ID ${accountId} removida com sucesso`);

        // Recarregar dados
        await Promise.all([loadAccountGroups(), loadAvailableAccounts()]);
      } else {
        let errorMessage = "Erro ao remover conta escrava";
        let errorDetails = "";

        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
          if (errorData.details) {
            errorDetails = errorData.details;
          }
        } catch (parseError) {
          errorDetails = `Status HTTP: ${response.status} - ${response.statusText}`;
        }

        throw new Error(
          errorMessage + (errorDetails ? ` (${errorDetails})` : "")
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      showError(
        "Erro ao Remover Conta Escrava",
        `Não foi possível remover a conta escrava:`,
        errorMessage
      );
      throw error;
    }
  };

  const handleEditGroupSubmit = async (groupData: {
    id: string;
    name: string;
    description: string;
    masterAccountId: string;
  }) => {
    try {
      addLog(`Salvando alterações do grupo: ${groupData.name}`);

      const response = await apiRequest(`/groups/${groupData.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: groupData.name,
          description: groupData.description,
          master_account_id: parseInt(groupData.masterAccountId),
        }),
      });

      if (response.ok) {
        addLog(`Grupo "${groupData.name}" atualizado com sucesso`);

        // Recarregar dados
        await Promise.all([
          refreshGroups(),
          loadAccountGroups(),
          loadAvailableAccounts(),
        ]);

        // Fechar modal
        setModals((prev) => ({ ...prev, editGroup: false }));
        setModalData({});
      } else {
        let errorMessage = "Erro ao editar grupo";
        let errorDetails = "";

        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
          if (errorData.details) {
            errorDetails = errorData.details;
          }
        } catch (parseError) {
          errorDetails = `Status HTTP: ${response.status} - ${response.statusText}`;
        }

        throw new Error(
          errorMessage + (errorDetails ? ` (${errorDetails})` : "")
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      showError(
        "Erro ao Editar Grupo",
        `Não foi possível editar o grupo "${groupData.name}":`,
        errorMessage
      );
      throw error;
    }
  };

  // Funções para exclusão de grupo
  const handleDeleteGroup = (group: AccountGroup) => {
    setGroupToDelete(group);
    setModals((prev) => ({ ...prev, deleteGroup: true }));
    addLog(`Solicitando exclusão do grupo: ${group.name}`);
  };

  const handleConfirmDeleteGroup = async () => {
    if (!groupToDelete) return;

    setDeleteLoading(true);
    try {
      addLog(`Iniciando exclusão do grupo: ${groupToDelete.name}`);

      // Chamar API para excluir grupo e todas as contas
      const response = await apiRequest(`/groups/${groupToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        addLog(
          `Grupo "${groupToDelete.name}" e todas as suas contas foram excluídos com sucesso`
        );

        // Recarregar dados
        await loadAccountGroups();

        // Fechar modal
        setModals((prev) => ({ ...prev, deleteGroup: false }));
        setGroupToDelete(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao excluir grupo");
      }
    } catch (error) {
      console.error("Erro ao excluir grupo:", error);
      addLog(
        `Erro ao excluir grupo: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
      // Manter o modal aberto para o usuário tentar novamente
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDeleteGroup = () => {
    setModals((prev) => ({ ...prev, deleteGroup: false }));
    setGroupToDelete(null);
    addLog("Exclusão de grupo cancelada");
  };

  const handleSyncType = async (type: string) => {
    if (!selectedGroupForSync) {
      showError(
        "Erro na Sincronização",
        "Selecione um grupo antes de iniciar a sincronização.",
        "Nenhum grupo foi selecionado para sincronização."
      );
      return;
    }

    try {
      const selectedGroup = groups.find(
        (g) => g.id.toString() === selectedGroupForSync
      );
      addLog(
        `Iniciando sincronização do grupo: ${
          selectedGroup?.name || selectedGroupForSync
        }`
      );
      setCurrentOperation(
        `Sincronizando grupo ${selectedGroup?.name || "selecionado"}`
      );
      setLoading(true);
      setSyncProgress(0);

      // Endpoint específico para sincronização de grupo
      const groupId = parseInt(selectedGroupForSync);
      const endpoint = `/sync/groups/${groupId}/trigger`;

      const requestData = {
        sync_type: type,
      };

      addLog(`Sincronizando grupo ID: ${groupId} - ${selectedGroup?.name}`);

      const response = await apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        addLog(`Sincronização ${type} iniciada com sucesso`);

        // Simular progresso - em uma implementação real, isso seria via WebSocket ou polling
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setSyncProgress(progress);
          setCurrentBatch(
            `Sincronizando grupo: ${selectedGroup?.name || "Grupo selecionado"}`
          );

          if (progress >= 100) {
            clearInterval(interval);
            setLoading(false);
            setCurrentOperation("Concluído");
            addLog(`Sincronização do grupo ${selectedGroup?.name} concluída`);
            // Recarregar dados após sincronização
            loadAccounts();
          }
        }, 1000);
      } else {
        // Obter mais detalhes do erro da resposta
        let errorMessage = "Erro na sincronização";
        let errorDetails = "";

        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
          if (errorData.details) {
            errorDetails = errorData.details;
          }
        } catch (parseError) {
          errorDetails = `Status HTTP: ${response.status} - ${response.statusText}`;
        }

        throw new Error(
          errorMessage + (errorDetails ? ` (${errorDetails})` : "")
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      showError(
        `Erro na Sincronização: ${type}`,
        "A sincronização falhou com o seguinte erro:",
        errorMessage
      );

      setLoading(false);
      setCurrentOperation("Erro");
      setSyncProgress(0);
    }
  };

  const handleStopSync = () => {
    addLog("Sincronização interrompida pelo usuário");
    setLoading(false);
    setCurrentOperation("Interrompido");
    setSyncProgress(0);
  };

  React.useEffect(() => {
    loadAccountGroups();
    refreshGroups();
  }, [loadAccountGroups]);

  React.useEffect(() => {
    updateStats(slaveAccounts);
  }, [slaveAccounts, accountGroups]);

  return (
    <div className="flex h-full flex-col">
      {" "}
      {/* Alterado para flex-col */}
      <main className="flex-1 ">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Gerenciamento Kommo</h1>
        </div>
        {/* Gerenciamento de Grupos */}
        <GroupManagement
          groups={groups}
          selectedGroup={selectedGroup}
          onGroupSelect={handleGroupSelect}
          onRefreshGroups={refreshGroups}
          onCreateGroup={handleCreateGroup}
          onAddAccount={handleAddAccount}
          // onShowDetails={handleShowGroupDetails}
          // onSyncGroup={handleSyncGroup}
        />
        {/* Visão Geral de Contas */}
        <AccountsOverview
          accounts={accountGroups}
          onRefresh={loadAccountGroups}
          onToggleViewMode={toggleViewMode}
          viewMode={viewMode}
          onAddSlaveAccount={openAddSlaveAccountModal}
          onViewAllAccounts={openViewAllAccountsModal}
          onEditGroup={handleEditGroup}
          onDeleteGroup={handleDeleteGroup}
        />

        {/* Status da Sincronização */}
        <SyncStatus
          status="syncing"
          progress={syncProgress}
          currentOperation={currentOperation}
          currentBatch={currentBatch}
          estimatedTime={estimatedTime}
        />
        {/* Seleção de Grupo para Sincronização */}
        <div className="card bg-base-300 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-base-content mb-5 text-xl flex items-center gap-3">
              <i className="fas fa-layer-group"></i>
              Sincronizar Grupo
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <label className="flex items-center gap-2 text-base-content font-medium">
                <i className="fas fa-filter"></i>
                Grupo a sincronizar:
              </label>
              <select
                className="select select-bordered flex-1 bg-base-100 text-base-content focus:outline-0"
                value={selectedGroupForSync}
                onChange={(e) => {
                  setSelectedGroupForSync(e.target.value);
                  const groupName =
                    groups.find((g) => g.id.toString() === e.target.value)
                      ?.name || "Grupo selecionado";
                  addLog(`Grupo selecionado para sincronização: ${groupName}`);
                }}
              >
                <option value="">Selecione um grupo</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id.toString()}>
                    📁 {group.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedGroupForSync && (
              <div className="mt-4 p-4 bg-info bg-opacity-20 rounded-lg border-l-4 border-info">
                <p className="text-info-content text-sm">
                  <i className="fas fa-info-circle mr-2"></i>A sincronização
                  será aplicada ao grupo "
                  {
                    groups.find((g) => g.id.toString() === selectedGroupForSync)
                      ?.name
                  }
                  " - dados da conta master serão replicados para todas as
                  contas escravas do grupo.
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Ações de Sincronização */}
        <SyncActions
          onSync={handleSyncType}
          onStop={handleStopSync}
          syncInProgress={loading}
          disabled={!selectedGroupForSync}
        />
        {/* Múltiplas Contas */}
        {/* <MultiAccountSection
          accounts={slaveAccounts}
          selectedAccounts={selectedAccounts}
          onToggleSelection={toggleAccountSelection}
          onSyncAccount={syncAccount}
          onRefresh={loadAccountGroups}
          onSync={() => console.log("Sync all slave accounts")}
          onAccountAction={(action: any, account: any) =>
            console.log(action, account)
          }
          syncParallel={syncParallel}
          setSyncParallel={setSyncParallel}
          continueOnError={continueOnError}
          setContinueOnError={setContinueOnError}
        /> */}
        {/* Botões de Teste (temporários para demonstração) */}
        {/* <div className="mb-6 flex gap-3">
          <button
            onClick={testError}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-sm"
          >
            🧪 Testar Notificação de Erro
          </button>
          <button
            onClick={testLogs}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
          >
            📝 Testar Logs Coloridos
          </button>
        </div> */}
        {/* Logs da Sincronização */}
        {/* <LogsSection
          logs={logs}
          onClearLogs={clearLogs}
          onClear={clearLogs}
          onDownload={() => console.log("Download logs")}
        /> */}
        {/* Estatísticas */}
        {/* <StatsSection stats={stats} /> */}

        {/* Modais */}
        <CreateGroupModal
          isOpen={modals.createGroup}
          onClose={() => closeModal("createGroup")}
          onCreate={handleCreateGroupSubmit}
          availableAccounts={availableAccounts.filter((acc) => acc.is_master)}
        />
        <AddAccountModal
          isOpen={modals.addAccount}
          onClose={() => closeModal("addAccount")}
          onAdd={handleAddAccountSubmit}
        />
        <EditGroupModal
          isOpen={modals.editGroup}
          onClose={() => closeModal("editGroup")}
          onUpdate={handleEditGroupSubmit}
          groupData={modalData.groupToEdit}
          availableAccounts={availableAccounts.filter((acc) => acc.is_master)}
          onRemoveSlaveAccount={handleRemoveSlaveAccount}
        />
        <AddSlaveAccountModal
          isOpen={modals.addSlaveAccount}
          onClose={() => closeModal("addSlaveAccount")}
          onAdd={handleAddSlaveAccountSubmit}
          groupSlaves={modalData.groupSlaves}
          onAssociate={async (accountId: number) => {
            console.log(accountId, modalData);
            // Exemplo: associar conta escrava ao grupo
            if (!modalData.selectedGroupForAccount) return;
            try {
              const response = await apiRequest(
                `/groups/${modalData.selectedGroupForAccount}/slaves`,
                {
                  method: "POST",
                  body: JSON.stringify({ account_id: accountId }),
                }
              );
              if (response.ok) {
                // Atualizar grupos/contas após associação
                loadAccountGroups();
              } else {
                // Tratar erro
                const errorData = await response.json();
                throw new Error(
                  errorData.error || "Erro ao associar conta escrava"
                );
              }
            } catch (err) {
              // Notificar erro
              setErrorNotification({
                show: true,
                title: "Erro ao associar conta escrava",
                message: err instanceof Error ? err.message : String(err),
              });
            }
          }}
          groupName={modalData.selectedGroupName}
        />
        <ViewAllAccountsModal
          isOpen={modals.viewAllAccounts}
          onClose={() => closeModal("viewAllAccounts")}
          accounts={modalData.selectedGroupAccounts || []}
          groupName={modalData.selectedGroupName || ""}
          onAddAccount={() => {
            closeModal("viewAllAccounts");
            if (modalData.selectedGroupName) {
              openAddSlaveAccountModal("", modalData.selectedGroupName, []);
            }
          }}
        />
        <DeleteGroupModal
          isOpen={modals.deleteGroup}
          onClose={handleCancelDeleteGroup}
          onConfirm={handleConfirmDeleteGroup}
          group={groupToDelete}
          loading={deleteLoading}
        />

        {/* Modal de Notificação de Erro */}
        <Modal
          isOpen={errorNotification.show}
          onClose={hideError}
          title={errorNotification.title}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-error"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-base-content opacity-80 mb-3">
                  {errorNotification.message}
                </p>
                {errorNotification.details && (
                  <div className="p-3 bg-base-200 rounded-md">
                    <p className="text-xs text-base-content font-mono break-all">
                      {errorNotification.details}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={hideError} className="btn btn-error">
                Fechar
              </button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}
