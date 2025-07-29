import { useEffect, useState } from "react";
import Table from "../../components/Table";
import { getMonitoramentoTintim } from "../../services/clientesService";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { useParams } from "react-router";
import {
  telefoneFormater,
  telefoneFormaterWithoutMask,
} from "../../utils/telefoneFormater.js";
import Filter, { FilterInput } from "../../components/Filter/index.js";
import { parseISO } from "date-fns";
import { getTintim } from "../../services/clientesService";
import { formatDateWithoutTimezone } from "../../utils/dateFormater.js";

interface TintimData {
  nome_empresa: string;
  causa?: string;
  id: number;
  todas_unidades: boolean;
  unidade_formatada: string;
  nome_lead: string;
  telefone: string;
  nome_anuncio: string;
  nome_campanha: string;
  nome_conjunto: string;
  data_criacao: string;
  integrado: boolean;
  origem: string;
  midia: string;
}

function formatDateWithTimezone(data_criacao: string | number | Date) {
  const data = new Date(data_criacao);
  data.setHours(data.getHours() + 3);

  const dataFormatada = data.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const horaFormatada = data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${dataFormatada} ${horaFormatada}`;
}

export default function MonitoramentoTintim() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<TintimData[]>([]);
  const [tintimData, setTintimData] = useState<TintimData[]>([]);
  const [optionsEmpresas, setOptionsEmpresas] = useState<
    { label: string; value: string }[]
  >([]);
  console.log("ID do monitoramento Tintim:", id);
  const fetchClientes = async () => {
    const data = await getMonitoramentoTintim();
    console.log("Dados do monitoramento Tintim:", data);
    setData(data);
    const empresas = await getTintim();
    console.log("Empresas:", empresas);
    setOptionsEmpresas(
      empresas.map((empresa: { cliente: any }) => ({
        label: empresa.cliente,
        value: empresa.cliente,
      }))
    );
    console.log("Empresas:", optionsEmpresas);
    if (Array.isArray(data)) {
      setTintimData(data);
      return;
    }
  };
  useEffect(() => {
    fetchClientes();
  }, []);
  const inputs: FilterInput[] = [
    {
      label: "Empresa",
      name: "nome_empresa",
      type: "select",
      options: optionsEmpresas,
    },
    { label: "Nome", name: "nome_lead", type: "text" },
    { label: "Telefone", name: "telefone", type: "number" },
    { label: "Campanha", name: "nome_campanha", type: "text" },
    { label: "Conjunto", name: "nome_conjunto", type: "text" },
    { label: "Anúncio", name: "nome_anuncio", type: "text" },
    { label: "Mídia", name: "midia", type: "text" },
    { label: "Origem", name: "origem", type: "text" },
    { label: "Data Criação", name: "data_criacao", type: "date-range" },
    {
      label: "Integrado",
      name: "integrado",
      type: "radio",
      options: [
        { label: "Sim", value: "true" },
        { label: "Não", value: "false" },
      ],
    },
  ];

  function handleFilterSubmit(filterData: Record<string, string>) {
    console.log("Dados do filtro:", filterData);
    if (
      !filterData.nome_empresa &&
      !filterData.nome_lead &&
      !filterData.telefone &&
      !filterData.nome_anuncio &&
      !filterData.nome_campanha &&
      !filterData.nome_conjunto &&
      !filterData.origem &&
      !filterData.midia &&
      filterData.integrado === undefined &&
      !filterData.data_criacao
    ) {
      setTintimData(data);
      console.log("Nenhum filtro aplicado, exibindo todos os dados.");
      return;
    }

    const filteredData = data.filter((item) => {
      let integradoMatch = true;
      if (filterData.integrado === "true") {
        integradoMatch = item.integrado === true;
      } else if (filterData.integrado === "false") {
        integradoMatch = item.integrado === false;
      }

      let dataCriacaoMatch = true;
      if (filterData.data_criacao) {
        const [start, end] = filterData.data_criacao;
        if (start && end) {
          const startDate = parseISO(start);
          startDate.setHours(0, 0, 0, 0);
          const endDate = parseISO(end);
          endDate.setHours(23, 59, 59, 999);

          const itemDate = new Date(item.data_criacao);
          itemDate.setHours(itemDate.getHours() + 3);

          dataCriacaoMatch = itemDate >= startDate && itemDate <= endDate;
        }
      }

      return (
        (!filterData.nome_empresa ||
          item.nome_empresa
            .toLowerCase()
            .includes(filterData.nome_empresa.toLowerCase())) &&
        (!filterData.nome_lead ||
          item.nome_lead
            .toLowerCase()
            .includes(filterData.nome_lead.toLowerCase())) &&
        (!filterData.telefone ||
          telefoneFormaterWithoutMask(item.telefone).includes(
            filterData.telefone
          )) &&
        (!filterData.nome_anuncio ||
          item.nome_anuncio
            ?.toLowerCase()
            .includes(filterData.nome_anuncio.toLowerCase())) &&
        (!filterData.nome_campanha ||
          item.nome_campanha
            ?.toLowerCase()
            .includes(filterData.nome_campanha.toLowerCase())) &&
        (!filterData.nome_conjunto ||
          item.nome_conjunto
            ?.toLowerCase()
            .includes(filterData.nome_conjunto.toLowerCase())) &&
        (!filterData.origem ||
          item.origem
            ?.toLowerCase()
            .includes(filterData.origem.toLowerCase())) &&
        (!filterData.midia ||
          item.midia?.toLowerCase().includes(filterData.midia.toLowerCase())) &&
        dataCriacaoMatch &&
        integradoMatch
      );
    });
    setTintimData(filteredData);
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
          <h1 className="text-2xl font-bold">Monitoramento Tintim</h1>
        </div>
        <div className="w-full">
          {" "}
          {/* Container extra para o Filter */}
          <Filter onSubmit={handleFilterSubmit} inputs={inputs} />
        </div>
        <div className="overflow-x-auto">
          <Table
            columns={[
              { name: "Empresa", sortType: "string" as const },
              { name: "Nome", sortType: "string" as const },
              { name: "Telefone", sortable: false },
              { name: "Campanha", sortable: false },
              { name: "Conjunto", sortable: false },
              { name: "Anúncio", sortable: false },
              { name: "Mídia", sortable: false },
              { name: "Origem", sortable: false },
              { name: "Data Criação", sortType: "datetime" as const },
              { name: "Integrado", sortType: "boolean" as const },
              { name: "Causa", sortable: false },
            ]}
            data={tintimData.map(
              ({
                nome_empresa,
                nome_lead,
                telefone,
                nome_anuncio,
                nome_campanha,
                nome_conjunto,
                origem,
                midia,
                data_criacao,
                integrado,
                causa,
              }) => ({
                Empresa: nome_empresa,
                Nome: nome_lead || "N/A",
                Telefone: telefoneFormater(telefone) || "N/A",
                Anuncio: nome_anuncio || "N/A",
                Campanha: nome_campanha || "N/A",
                Conjunto: nome_conjunto || "N/A",
                Origem: origem || "N/A",
                Midia: midia || "N/A",
                DataCriacao: formatDateWithoutTimezone(data_criacao) || "N/A",
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
