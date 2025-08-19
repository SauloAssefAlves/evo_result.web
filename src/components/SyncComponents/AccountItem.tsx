import React from "react";
import Button from "./Button";
import { AccountItemProps } from "./types";

const AccountItem: React.FC<AccountItemProps> = ({ account, onAction }) => (
  <div className="bg-base-100 p-3 rounded-lg mb-2 border border-base-200 flex justify-between items-center">
    <div className="flex-1">
      <div className="font-medium text-base-content">{account.subdomain}</div>
      <div className="text-xs opacity-70">{account.info}</div>
    </div>
    <div className="flex items-center gap-2">
      <span
        className={`badge ${
          account.status === "online"
            ? "badge-success"
            : account.status === "offline"
            ? "badge-error"
            : ""
        }`}
      >
        {account.status}
      </span>
      {onAction && (
        <div className="flex gap-1">
          <Button size="small" onClick={() => onAction("edit", account)}>
            Editar
          </Button>
          <Button
            size="small"
            variant="danger"
            onClick={() => onAction("delete", account)}
          >
            Remover
          </Button>
        </div>
      )}
    </div>
  </div>
);

export default AccountItem;
