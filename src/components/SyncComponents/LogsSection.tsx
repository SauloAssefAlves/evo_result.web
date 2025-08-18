import React, { useRef, useEffect } from "react";
import Button from "./Button";
import { LogsSectionProps } from "./types";

const LogsSection: React.FC<LogsSectionProps> = ({
  logs,
  onClear,
  onDownload,
}) => {
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Scroll automático para o último log
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <h2 className="card-title text-base-content mb-5 text-xl font-semibold flex items-center gap-3">
          <i className="fas fa-list-alt"></i>
          Logs da Sincronização
        </h2>
        <div className="bg-neutral rounded-xl overflow-hidden">
          <div className="bg-neutral-focus p-4 flex justify-between items-center">
            <span className="text-neutral-content font-semibold">
              Console de Logs
            </span>
            <div className="flex gap-2">
              <Button size="small" onClick={onClear} icon="fas fa-trash">
                Limpar
              </Button>
              <Button size="small" onClick={onDownload} icon="fas fa-download">
                Baixar
              </Button>
            </div>
          </div>
          <div className="p-5 font-mono text-sm text-neutral-content max-h-96 overflow-y-auto">
            {logs.length > 0 ? (
              <div className="space-y-1">
                {logs.map((log, index) => {
                  // Definir cores baseadas no tipo de log
                  let logColor = "text-neutral-content";
                  if (log.includes("❌ ERRO")) {
                    logColor = "text-error";
                  } else if (log.includes("✅") || log.includes("sucesso")) {
                    logColor = "text-success";
                  } else if (log.includes("⚠️") || log.includes("WARNING")) {
                    logColor = "text-warning";
                  } else if (log.includes("📋") || log.includes("Detalhes")) {
                    logColor = "text-info";
                  } else if (log.includes("🚀") || log.includes("Iniciando")) {
                    logColor = "text-info";
                  }

                  return (
                    <div
                      key={index}
                      className={`leading-relaxed ${logColor} hover:bg-neutral px-2 py-1 rounded transition-colors`}
                    >
                      {log}
                    </div>
                  );
                })}
                {/* Elemento para scroll automático */}
                <div ref={logsEndRef} />
              </div>
            ) : (
              <div className="text-neutral-content opacity-70 italic">
                Sistema pronto para sincronização...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsSection;
