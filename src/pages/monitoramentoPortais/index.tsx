import { useEffect, useState } from "react";
import Table from "../../components/Table/index.js";
import { getMonitoramentoPortais } from "../../services/clientesService.js";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { useParams } from "react-router";
import {
  telefoneFormater,
  telefoneFormaterWithoutMask,
} from "../../utils/telefoneFormater.js";
import Filter, {FilterInput} from "../../components/Filter/index.js";
import { formatDateWithoutTimezone } from "../../utils/dateFormater.js";
import { getPortais } from "../../services/clientesService.js";
import { parseISO } from "date-fns";

interface PortaisData {
  nome: string;
  nome_lead: string;
  telefone: string;
  midia: string;
  data_criada: string;
  integrado: boolean;
  causa: string;
  valor?: number;
  veiculo?: string;
  origem?: string;
}

function formatDateWithTimezone(data_criacao: string | number | Date) {
  // Cria um objeto Date e adiciona 3 horas
  const data = new Date(data_criacao);
  data.setHours(data.getHours() + 3);

  // Formata a data no padrão brasileiro
  const dataFormatada = data.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Formata a hora no padrão brasileiro (24h)
  const horaFormatada = data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Retorna no formato "dd/mm/aaaa hh:mm +0300"
  return `${dataFormatada} ${horaFormatada}`;
}

export default function MonitoramentoPotais() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<PortaisData[]>([]);
  const [portaisData, setPortaisData] = useState<PortaisData[]>([]);
  const [optionsEmpresas, setOptionsEmpresas] =
    useState<{ label: string; value: string }[]>();
  console.log("ID do monitoramento Tintim:", id);
  const fetchClientes = async () => {
    const data = await getMonitoramentoPortais();
    console.log("Dados do monitoramento Tintim:", data);
    setData(data);
    const empresas = await getPortais();
    console.log("Empresas:", empresas);
    setOptionsEmpresas(
      empresas.map((empresa: { nome: any }) => ({
        label: empresa.nome,
        value: empresa.nome,
      }))
    );
    if (Array.isArray(data)) {
      setPortaisData(data);
      return;
    }
  };
  useEffect(() => {
    fetchClientes();
  }, []);
  const inputs: FilterInput[] = [
    {
      label: "Empresa",
      name: "Empresa",
      type: "select",
      options: optionsEmpresas,
    },
    { label: "Nome", name: "Nome", type: "text" },
    { label: "Telefone", name: "Telefone", type: "number" },
    { label: "Midia", name: "Midia", type: "text" },
    { label: "Origem", name: "Origem", type: "text" },
    { label: "Valor", name: "Valor", type: "number" },
    { label: "Data Criacão", name: "data_criacao", type: "date-range" },
    {
      label: "Integrado",
      name: "Integrado",
      type: "radio",
      options: [
        { label: "Sim", value: "true" },
        { label: "Não", value: "false" },
      ],
    },
  ];

  function handleFilterSubmit(filterData: Record<string, any>) {
    console.log("Dados do filtro:", filterData);
    if (
      !filterData.Empresa &&
      !filterData.Nome &&
      !filterData.Telefone &&
      !filterData.data_criacao &&
      filterData.Integrado === undefined &&
      !filterData.Midia &&
      !filterData.Origem &&
      !filterData.Valor
    ) {
      setPortaisData(data);
      console.log("Nenhum filtro aplicado, exibindo todos os dados.");
      return;
    }

    const filteredData = data.filter((item) => {
      let integradoMatch = true;
      if (filterData.Integrado === "true") {
        integradoMatch = item.integrado === true;
      } else if (filterData.Integrado === "false") {
        integradoMatch = item.integrado === false;
      }

      let dataCriacaoMatch = true;
      if (filterData.data_criacao && Array.isArray(filterData.data_criacao)) {
        const [start, end] = filterData.data_criacao;
        if (start && end) {
          const startDate = parseISO(start);
          startDate.setHours(0, 0, 0, 0);
          const endDate = parseISO(end);
          endDate.setHours(23, 59, 59, 999);

          const itemDate = new Date(item.data_criada);
          itemDate.setHours(itemDate.getHours() + 3);

          dataCriacaoMatch = itemDate >= startDate && itemDate <= endDate;
        }
      }

      const midiaMatch =
        !filterData.Midia ||
        (item.midia &&
          item.midia.toLowerCase().includes(filterData.Midia.toLowerCase()));

      const origemMatch =
        !filterData.Origem ||
        (item.origem &&
          item.origem.toLowerCase().includes(filterData.Origem.toLowerCase()));

      const valorMatch =
        !filterData.Valor ||
        (item.valor !== undefined &&
          String(item.valor).includes(filterData.Valor));

      return (
        (!filterData.Empresa ||
          (item.nome &&
            item.nome
              .toLowerCase()
              .includes(filterData.Empresa.toLowerCase()))) &&
        (!filterData.Nome ||
          (item.nome_lead &&
            item.nome_lead
              .toLowerCase()
              .includes(filterData.Nome.toLowerCase()))) &&
        (!filterData.Telefone ||
          telefoneFormaterWithoutMask(item.telefone).includes(
            filterData.Telefone
          )) &&
        dataCriacaoMatch &&
        integradoMatch &&
        midiaMatch &&
        origemMatch &&
        valorMatch
      );
    });
    setPortaisData(filteredData);
    console.log("Dados filtrados:", filteredData);
  }

  return (
    <div className="flex h-full flex-col">
      {" "}
      {/* Alterado para flex-col */}
      <main className="flex-1 overflow-auto">
        {" "}
        {/* Adicionado overflow-auto */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Monitoramento Portais</h1>
        </div>
        <div className="w-full">
          {" "}
          {/* Container extra para o Filter */}
          <Filter onSubmit={handleFilterSubmit} inputs={inputs} />
        </div>
        <div className="overflow-x-auto">
          <Table
            columns={[
              "Empresa",
              "Nome",
              "Telefone",
              "Mídia",
              "Origem",
              "Valor",
              "Data Criação",
              "Integrado",
              "Causa",
            ]}
            data={portaisData.map(
              ({
                nome,
                nome_lead,
                telefone,
                origem,
                midia,
                valor,
                data_criada,
                integrado,
                causa,
              }) => ({
                Empresa: nome,
                Nome: nome_lead || "N/A",
                Telefone: telefoneFormater(telefone) || "N/A",
                Origem: origem || "N/A",
                Midia: midia || "N/A",
                Valor: valor ? `R$ ${valor}` : "N/A",
                DataCriacao: formatDateWithoutTimezone(data_criada) || "N/A",
                Integrado: integrado ? (
                  <FaCheck className="text-success text-xl" />
                ) : (
                  <ImCross className="text-error" />
                ),
                Causa: causa || "N/A",
              })
            )}
          />
        </div>
      </main>
    </div>
  );
}
