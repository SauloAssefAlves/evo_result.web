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
import Filter from "../../components/Filter/index.js";

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
  source: string;
  midia: string;
}

export default function MonitoramentoTintim() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<TintimData[]>([]);
  const [tintimData, setTintimData] = useState<TintimData[]>([]);
  console.log("ID do monitoramento Tintim:", id);
  const fetchClientes = async () => {
    const data = await getMonitoramentoTintim();
    console.log("Dados do monitoramento Tintim:", data);
    setData(data);
    // Se a resposta for um array, atualiza o estado tintimData
    if (Array.isArray(data)) {
      setTintimData(data);
      return;
    }
  };
  useEffect(() => {
    fetchClientes();
  }, []);
  const inputs = [
    { label: "Empresa", type: "text" },
    { label: "Nome", type: "text" },
    { label: "Telefone", type: "number" },
    { label: "data_criacao", type: "date" },
  ];

  function handleFilterSubmit(filterData: Record<string, string>) {
    console.log("Dados do filtro:", filterData);
    if (
      !filterData.Empresa &&
      !filterData.Nome &&
      !filterData.Telefone &&
      !filterData.data_criacao
    ) {
      // Se nenhum filtro for aplicado, buscar novamente os dados originais
      setTintimData(data);
      console.log("Nenhum filtro aplicado, exibindo todos os dados.");
      return;
    }

    // Filtrar os dados com base nos inputs, permitindo busca parcial (case insensitive)
    const filteredData = data.filter((item) => {
      console.log(
        new Date(item.data_criacao).toLocaleDateString("pt-BR"),
        new Date(filterData.data_criacao).toLocaleDateString("pt-BR")
      );
      return (
        (!filterData.Empresa ||
          item.nome_empresa
            .toLowerCase()
            .includes(filterData.Empresa.toLowerCase())) &&
        (!filterData.Nome ||
          item.nome_lead
            .toLowerCase()
            .includes(filterData.Nome.toLowerCase())) &&
        (!filterData.Telefone ||
          telefoneFormaterWithoutMask(item.telefone).includes(
            filterData.Telefone
          )) &&
        (!filterData.data_criacao ||
          new Date(item.data_criacao).toLocaleDateString("pt-BR") ===
            new Date(filterData.data_criacao).toLocaleDateString("pt-BR"))
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
              "Empresa",
              "Nome",
              "Telefone",
              "Anúncio",
              "Campanha",
              "Conjunto",
              "Origem",
              "Mídia",
              "Data Criação",
              "Integrado",
              "Causa",
            ]}
            data={tintimData.map(
              ({
                nome_empresa,
                nome_lead,
                telefone,
                nome_anuncio,
                nome_campanha,
                nome_conjunto,
                source,
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
                Origem: source || "N/A",
                Midia: midia || "N/A",
                DataCriacao:
                  new Date(data_criacao).toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }) +
                  " " +
                  new Date(data_criacao).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
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
