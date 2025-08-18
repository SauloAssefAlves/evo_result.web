import { ReactNode } from "react";

export interface Account {
  info: ReactNode;
  status: string;
  id: number;
  subdomain: string;
  is_master: boolean;
  created_at: string;
  updated_at: string;
}

export interface MasterAccount {
  id: number;
  subdomain: string;
  status?: "active" | "inactive";
}

export interface SlaveAccount {
  id: number;
  subdomain: string;
  contact_count?: number;
  last_sync?: string;
  status?: "active" | "inactive";
}

export interface AccountGroup {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  master_account: MasterAccount;
  slave_count: number;
  last_sync?: {
    started_at: string;
    completed_at: string;
    status: string;
  };
  slave_accounts?: SlaveAccount[];
  total_contacts?: number;
}

export interface Stats {
  totalAccounts: number;
  syncing: number;
  completed: number;
  errors: number;
  pipelines: number;
  groups: number;
  fields: number;
  time: string;
}

export interface HeaderProps {}

export interface StatCardProps {
  title: string;
  value: number | string;
  color?: string;
  icon: string;
}

export interface AccountItemProps {
  account: Account;
  isSelected?: boolean;
  onToggleSelection?: (accountId: string) => void;
  onSync?: (accountId: string) => void;
  onAction: (action: string, account: Account) => void;
}

export interface SyncActionsProps {
  onSync: (type: string) => void;
  onStop: () => void;
  syncInProgress: boolean;
  disabled?: boolean;
  showFull?: boolean;
  showPipelines?: boolean;
  showCustomFields?: boolean;
  showFieldGroups?: boolean;
  showRequiredStatuses?: boolean;
  showRoles?: boolean;
}

export interface BatchConfigProps {
  batchSize: number;
  onBatchSizeChange?: (size: number) => void;
  setBatchSize: (value: string) => void;
  batchDelay: number;
  setBatchDelay: (value: string) => void;
  maxConcurrent: number;
  setMaxConcurrent: (value: string) => void;
}

export interface SyncStatusProps {
  status: "online" | "offline" | "error" | "syncing" | "completed";
  progress: number;
  currentOperation: string;
  currentBatch: string;
  estimatedTime: string;
}

export interface LogsSectionProps {
  logs: string[];
  onClearLogs?: () => void;
  onClear: () => void;
  onDownload: () => void;
}

export interface MultiAccountSectionProps {
  accounts: Account[];
  selectedAccounts?: Set<string>;
  onToggleSelection?: (accountId: string) => void;
  onSyncAccount?: (accountId: number) => Promise<void>;
  onRefresh: () => void;
  onSync: () => void;
  onAccountAction: (action: string, account: Account) => void;
  syncParallel: boolean;
  setSyncParallel: (value: boolean) => void;
  continueOnError: boolean;
  setContinueOnError: (value: boolean) => void;
}

export interface StatsSectionProps {
  stats: Stats;
}

export interface AccountsOverviewProps {
  accounts: AccountGroup[];
  onRefresh: () => void;
  onToggleViewMode: () => void;
  viewMode: "expanded" | "compact";
  onAddSlaveAccount?: (
    groupId: string,
    groupName: string,
    groupSlaves: Array<{
      id: number;
      subdomain: string;
      status?: string;
      contact_count?: number;
    }>
  ) => void;
  onViewAllAccounts?: (accounts: any[], groupName: string) => void;
  onEditGroup?: (group: AccountGroup) => void;
  onSyncGroup?: (groupId: string) => void;
  onDeleteGroup?: (group: AccountGroup) => void;
}

export interface GroupManagementProps {
  groups: Group[];
  selectedGroup: string;
  onGroupSelect: (groupId: string) => void;
  onRefreshGroups: () => void;
  onCreateGroup: () => void;
  onAddAccount: () => void;
  onShowDetails: () => void;
  onSyncGroup: () => void;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  masterAccount: string;
  slaveAccounts: string[];
}

export interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger" | "outline" | "primary-large";
  size?: "small" | "normal" | "large";
  children: React.ReactNode;
  icon?: string;
  className?: string;
  style?: React.CSSProperties;
}
