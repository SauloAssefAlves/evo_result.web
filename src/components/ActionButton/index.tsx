import { ReactElement } from "react";

interface ActionButtonProps {
  action: () => void;
  label: string | ReactElement;
}

export function ActionButton({ action, label }: ActionButtonProps) {
  return (
    <button
      className="btn btn-neutral border-0 hover:text-neutral hover:bg-primary"
      onClick={action}
    >
      {label}
    </button>
  );
}
