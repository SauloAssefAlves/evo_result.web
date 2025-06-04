import { useParams } from "react-router";
import { useEffect, useState, useRef } from "react";
import {
  getClientesPipeline,
  getPipelines,
  cadastrarClientePipeline,
  excluirClientePipeline,
  getClientes,
} from "../../services/clientesService";
import Table from "../../components/Table";
import DeleteWarning from "../../components/DeleteWarning";
import { toast } from "react-toastify";

export default function Pipelines() {
  const { id } = useParams(); // Pegando o ID da URL
  const [cliente, setCliente] = useState<{
    id: number;
    nome: string;
    token: string;
    automotivo: boolean;
  } | null>(null); // Estado para o cliente
  const modalRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedPipeline, setSelectedPipeline] = useState(""); // Estado para o select
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [pipelinesCadastradas, setPipelinesCadastradas] = useState<
    Array<{
      id: number;
      cliente_id: number;
      nome: string;
      pipeline_id: number;
      subdomain: string;
    }>
  >([]);
  const [pipelines, setPipelines] = useState<
    Array<{ id: number; nome: string }>
  >([]);

  useEffect(() => {
    const fetchClientes = async () => {
      if (!id) return;
      const clienteData = await getClientes();
      const clienteEncontrado = clienteData.find(
        (cliente: { id: number }) => cliente.id === Number(id)
      );
      setCliente(clienteEncontrado || null);
      const data = await getClientesPipeline(id); // Convertendo id para número
      const pipelinesData = await getPipelines(Number(id));
      console.log("Pipelines:", pipelinesData);
      setPipelines(pipelinesData);
      setPipelinesCadastradas(data);
    };

    fetchClientes();
  }, [id]);

  const handleAddPipeline = async (event: React.FormEvent) => {
    event.preventDefault();
    const pipelineSelecionada = pipelines.find(
      (pipeline) => pipeline.id === Number(selectedPipeline)
    );
    console.log("Pipeline selecionada:", pipelineSelecionada);
    if (!pipelineSelecionada) {
      console.error("Pipeline não encontrada");
      return;
    }

    const body = {
      cliente_id: Number(id),
      pipeline_id: Number(selectedPipeline),
      nome: pipelineSelecionada?.nome,
    };
    const response = await cadastrarClientePipeline(body);
    console.log("Resposta do cadastro:", response);
    if (!response.success) {
      setErrorMessage(response.message || "Erro ao cadastrar Tintim.");
      return;
    }
    const data = await getClientesPipeline(id);
    setPipelinesCadastradas(data);
    toast.success("Pipeline cadastrada com sucesso!");

    modalRef.current?.close();
  };

  async function excluir(id: number) {
    console.log("Excluindo pipeline:", id);
    const response = await excluirClientePipeline(id);
    console.log("Resposta da exclusão:", response);
    if (!response.success) {
      toast.error("Erro ao excluir pipeline.");
      return;
    }
    setPipelinesCadastradas((prev) =>
      prev.filter((pipeline) => pipeline.id !== id)
    );

    toast.success("Pipeline excluida com sucesso!");
  }
  function buttons(id: number) {
    return (
      <div className="flex gap-2 items-center justify-center">
        <DeleteWarning onConfirm={() => excluir(id)} />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Conteúdo principal */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            Lista de Pipelines de{" "}
            <span className="capitalize">{cliente?.nome}</span>
          </h1>
          <button
            className="btn btn-primary text-neutral"
            onClick={() => modalRef.current?.showModal()}
          >
            + Adicionar Pipeline
          </button>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <Table
            columns={["Nome", "Ações"]}
            data={pipelinesCadastradas.map(({ nome, id }) => ({
              Nome: nome,
              Ações: buttons(id),
            }))}
          />
        </div>
      </main>

      {/* Modal de Adicionar Pipeline */}
      <dialog
        ref={modalRef}
        className="modal fixed inset-0 flex items-center justify-center"
      >
        <div className="modal-box ">
          <h2 className="text-lg font-bold mb-4">
            <span className="text-primary">[ </span>
            Nova Pipeline
            <span className="text-primary"> ] </span>
          </h2>
          <form
            ref={formRef}
            onSubmit={handleAddPipeline}
            className="flex flex-col gap-4"
          >
            {/* Select de Pipelines */}
            <select
              className="select select-bordered w-full focus:outline-none"
              value={selectedPipeline}
              onChange={(e) => {
                setErrorMessage(null); // Limpa a mensagem de erro ao selecionar um pipeline
                setSelectedPipeline(e.target.value);
              }}
              required
            >
              <option value="">Selecione um pipeline</option>
              {pipelines.map((pipeline) => (
                <option key={pipeline.id} value={pipeline.id}>
                  {pipeline.nome}
                </option>
              ))}
            </select>
            {errorMessage && (
              <p className="text-red-500 text-sm text-center">{errorMessage}</p>
            )}

            <div className="modal-action">
              <button type="submit" className="btn btn-success">
                Adicionar
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => modalRef.current?.close()}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
