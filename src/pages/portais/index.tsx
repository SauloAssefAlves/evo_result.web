import { useEffect, useState, useRef, SetStateAction } from "react";
import { toast } from "react-toastify";
import Table from "../../components/Table";
import {
  getPortais,
  getClientes,
  getClientePeloId,
  getPipelines,
  cadastrarPortais,
  excluirClientePortais,
} from "../../services/clientesService";
import DeleteWarning from "../../components/DeleteWarning";

export default function Portais() {
  const [portaisData, setPortais] = useState<
    { id: number; nome: string; pipeline: string; status_pipeline: string }[]
  >([]);
  const [clientes, setClientes] = useState<{ id: number; nome: string }[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [pipelines, setPipelines] = useState<
    {
      nome: string;
      id: number;
      status: { id: number; nome: string; is_editable: boolean }[];
    }[]
  >([]);
  const [status, setStatus] = useState<
    {
      nome: string;
      id: number;
      is_editable: boolean;
    }[]
  >([]);
  const [pipelineSelecionada, setPipelineSelecionada] = useState<string>("");
  const [statusSelecionada, setStatusSelecionada] = useState<string>("");
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [loadingPipelines, setLoadingPipelines] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const fetchClientes = async () => {
    const data = await getPortais();
    console.log("Portais:", data);
    setPortais(data);
  };
  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    const fetchTodosClientes = async () => {
      setLoadingClientes(true);
      const clientesData = await getClientes();
      setClientes(clientesData);
      setLoadingClientes(false);
    };

    fetchTodosClientes();
  }, []);

  const handleAddPortal = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const cliente_id = formData.get("cliente");
    const pipeline = formData.get("pipeline");
    const status = formData.get("status");

    const cliente_nome = clientes.find(
      (cliente) => cliente.id === Number(clienteSelecionado)
    )?.nome;
    console.log("Nome do cliente:", cliente_nome);
    console.log("Cliente:", cliente_id);
    console.log("Pipeline:", pipeline);
    console.log("Status:", status);

    if (cliente_id || pipeline || status || cliente_nome) {
      const response = await cadastrarPortais({
        cliente_id: Number(cliente_id),
        pipeline_id: Number(pipeline),
        status_id: Number(status),
        nome: cliente_nome as string,
      });

      console.log("Response:", response);

      if (!response.success) {
        console.log("Erro ao cadastrar:", response.message);
        setErrorMessage(response.message || "Erro ao cadastrar Tintim.");
        return;
      }

      fetchClientes();
      setErrorMessage(null);
      modalRef.current?.close();
      setClienteSelecionado("");
      setPipelines([]);
      setLoadingPipelines(false);
      toast.success(response.message);
    }
  };

  const handleSearchCliente = async (id_cliente: SetStateAction<string>) => {
    try {
      setClienteSelecionado(id_cliente);
      setPipelineSelecionada("");
      setStatus([]);
      setPipelines([]);
      setLoadingPipelines(true);
      setErrorMessage(null);

      if (!id_cliente) {
        setPipelines([]);
        setLoadingPipelines(false);
        return;
      }

      const [encontrado] = await getClientePeloId(id_cliente as string);

      if (encontrado) {
        const pipelinesCliente = await getPipelines(encontrado.id);
        console.log("Pipelines do cliente:", pipelinesCliente);
        setPipelines(pipelinesCliente);
      } else {
        setPipelines([]);
      }

      setLoadingPipelines(false);
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      setLoadingPipelines(false);
    }
  };

  async function handleSearchPipeline(id_pipeline: SetStateAction<number>) {
    try {
      setLoadingStatus(true);
      setErrorMessage(null);
      console.log("ID do pipeline:", id_pipeline);
      const statusData = pipelines.find(
        (pipeline) => pipeline.id === id_pipeline
      )?.status;

      console.log("Status do cliente:", statusData);

      if (!statusData) {
        setPipelines([]);
        setLoadingPipelines(false);
        return;
      }

      if (statusData) {
        const statusFiltered = statusData.filter(
          (status) => status.is_editable === true
        );

        console.log("Unidades do cliente:", statusFiltered);
        console.log("filtered", statusFiltered);
        setStatus(statusFiltered);
      } else {
        setPipelines([]);
      }

      setLoadingStatus(false);
    } catch (error) {
      console.error("Erro ao buscar status:", error);
      setLoadingStatus(false);
    }
  }

  async function excluir(id: number) {
    console.log("Excluindo portal:", id);
    const response = await excluirClientePortais(id);
    console.log("Resposta da exclusão:", response);
    if (!response.success) {
      toast.error("Erro ao excluir pipeline.");
      return;
    }
    setPortais((prev) => prev.filter((portal) => portal.id !== id));

    toast.success("Portal excluido com sucesso!");
  }
  function buttonDelete(id: number) {
    return (
      <div className="flex gap-2 items-center justify-center">
        <DeleteWarning onConfirm={() => excluir(id)} />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Clientes com TinTim</h1>
          <button
            className="btn btn-primary text-neutral"
            onClick={() => modalRef.current?.showModal()}
          >
            + Adicionar Portal
          </button>
        </div>

        <div className="overflow-x-auto">
          <Table
            columns={["Cliente", "Funil", "Status", "Ações"]}
            data={portaisData.map(
              ({ id, nome, pipeline, status_pipeline }) => ({
                Cliente: nome,
                Funil: pipeline,
                Status: status_pipeline,
                Ações: buttonDelete(id),
              })
            )}
          />
        </div>
      </main>

      <dialog ref={modalRef} className="modal ">
        <div className="modal-box  ">
          <h2 className="text-lg font-bold mb-4">
            <span className="text-primary">[ </span>
            Novo Tintim
            <span className="text-primary"> ] </span>
          </h2>
          <form
            ref={formRef}
            onSubmit={handleAddPortal}
            className="flex flex-col gap-4"
          >
            {/* Select de clientes com Skeleton */}
            {loadingClientes ? (
              <div className="skeleton h-10 w-full rounded-md"></div>
            ) : (
              <select
                name="cliente"
                required
                className="select select-bordered w-full focus:outline-none"
                value={clienteSelecionado}
                onChange={(e) => handleSearchCliente(e.target.value)}
              >
                <option value="" disabled>
                  Selecione um cliente
                </option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </option>
                ))}
              </select>
            )}

            {/* Select de pipeline com Skeleton */}
            {loadingPipelines ? (
              <div className="skeleton h-10 w-full rounded-md"></div>
            ) : (
              pipelines.length > 0 && (
                <>
                  <select
                    name="pipeline"
                    required
                    className="select select-bordered w-full focus:outline-none"
                    value={pipelineSelecionada}
                    onChange={(e) => {
                      handleSearchPipeline(Number(e.target.value));
                      setErrorMessage(null);
                      setPipelineSelecionada(e.target.value);
                    }}
                  >
                    <option value="" disabled>
                      Selecione uma unidade
                    </option>
                    {pipelines.map((pipeline) => (
                      <option key={pipeline.id} value={pipeline.id}>
                        {pipeline.nome || ""}
                      </option>
                    ))}
                  </select>
                </>
              )
            )}

            {/* Select de status com Skeleton */}
            {loadingStatus ? (
              <div className="skeleton h-10 w-full rounded-md"></div>
            ) : (
              status.length > 0 && (
                <>
                  <select
                    name="status"
                    required
                    className="select select-bordered w-full focus:outline-none"
                    value={statusSelecionada}
                    onChange={(e) => {
                      setErrorMessage(null);
                      setStatusSelecionada(e.target.value);
                    }}
                  >
                    <option value="" disabled>
                      Selecione um status
                    </option>
                    {status.map((data) => (
                      <option key={data.id} value={data.id}>
                        {data.nome || ""}
                      </option>
                    ))}
                  </select>
                  {errorMessage && (
                    <p className="text-red-500 text-sm text-center">
                      {errorMessage}
                    </p>
                  )}
                </>
              )
            )}

            <div className="modal-action">
              <button type="submit" className="btn btn-success">
                Salvar
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  // Resetando o valor do cliente selecionado
                  setClienteSelecionado("");
                  setPipelines([]);
                  setLoadingPipelines(false);
                  setErrorMessage(null);
                  setStatusSelecionada("");
                  setStatus([]);
                  setPipelineSelecionada("");
                  // Fechando o modal
                  modalRef.current?.close();
                }}
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
