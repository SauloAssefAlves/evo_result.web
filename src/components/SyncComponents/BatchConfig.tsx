import React from "react";
import { BatchConfigProps } from "./types";

const BatchConfig: React.FC<BatchConfigProps> = ({
  batchSize,
  setBatchSize,
  batchDelay,
  setBatchDelay,
  maxConcurrent,
  setMaxConcurrent,
}) => (
  <div className="rounded-2xl p-6 mb-6  shadow-sm bg-base-300">
    <h2 className="text-2xl font-semibold mb-5 flex items-center gap-3">
      <i className="fas fa-cogs text-base-content"></i>
      Configurações de Lote
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="batchSize" className="text-base-content font-semibold">
          Tamanho do Lote:
        </label>
        <input
          type="number"
          id="batchSize"
          min="1"
          max="100"
          value={batchSize}
          onChange={(e) => setBatchSize(e.target.value)}
          className="input focus:outline-0 placeholder:font-semibold"
        />
        <span className="text-sm text-base-content opacity-70 italic">
          Quantos itens processar por vez
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="batchDelay" className="text-base-content font-semibold">
          Delay entre Lotes (segundos):
        </label>
        <input
          type="number"
          id="batchDelay"
          min="0"
          max="60"
          step="0.5"
          value={batchDelay}
          onChange={(e) => setBatchDelay(e.target.value)}
          className="input focus:outline-0 placeholder:font-semibold"
        />
        <span className="text-sm text-base-content opacity-70 italic">
          Tempo de espera entre lotes para não sobrecarregar
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="maxConcurrent"
          className="text-base-content font-semibold"
        >
          Contas Simultâneas:
        </label>
        <input
          type="number"
          id="maxConcurrent"
          min="1"
          max="10"
          value={maxConcurrent}
          onChange={(e) => setMaxConcurrent(e.target.value)}
          className="input focus:outline-0 placeholder:font-semibold"
        />
        <span className="text-sm text-base-content opacity-70 italic">
          Quantas contas sincronizar ao mesmo tempo
        </span>
      </div>
    </div>
  </div>
);

export default BatchConfig;
