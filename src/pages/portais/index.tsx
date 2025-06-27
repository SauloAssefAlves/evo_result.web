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
  editarPortal,
} from "../../services/clientesService";
import DeleteWarning from "../../components/DeleteWarning";
import { FaEdit, FaAlignRight } from "react-icons/fa";
import { ActionButton } from "../../components/ActionButton";
import { formatDateWithoutTimezone } from "../../utils/dateFormater";
import { useNavigate } from "react-router";

export default function Portais() {
  const [portaisData, setPortais] = useState<
    {
      id: number;
      nome: string;
      pipeline: string;
      status_pipeline: string;
      pipeline_id: number;
      status_id: number;
      id_cliente: number;
      data_ultimo_lead: string;
    }[]
  >([]);
  const [clientes, setClientes] = useState<{ id: number; nome: string }[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [pipelines, setPipelines] = useState<
    {
      nome: string;
      id: number;
      status: {
        id: number;
        nome: string;
        is_editable: boolean;
        type: number;
      }[];
    }[]
  >([]);
  const [status, setStatus] = useState<
    {
      nome: string;
      id: number;
      is_editable: boolean;
      type: number;
    }[]
  >([]);
  const [pipelineSelecionada, setPipelineSelecionada] = useState<string>("");
  const [statusSelecionada, setStatusSelecionada] = useState<string>("");
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [loadingPipelines, setLoadingPipelines] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editClienteSelecionado, setEditClienteSelecionado] = useState<{
    id: number;
    nome: string;
    pipeline_id: number;
    status_id: number;
  }>({ id: 0, nome: "", pipeline_id: 0, status_id: 0 });
  const [valid, setValid] = useState<boolean>(true);
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const editFormRef = useRef<HTMLFormElement>(null);
  const modalEditRef = useRef<HTMLDialogElement>(null);
  const fetchClientes = async () => {
    const data = await getPortais();
    setPortais(data);
    console.log("Portais data:", data);
  };
  useEffect(() => {
    fetchClientes();
    console.log("Portais fetched:", portaisData);
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
    const statusId = formData.get("status");

    const statusSelelect = status.find((s) => s.id === Number(statusId));
    if (!statusSelelect) {
      setErrorMessage("Selecione um status válido.");
      return;
    }

    const cliente_nome = clientes.find(
      (cliente) => cliente.id === Number(clienteSelecionado)
    )?.nome;

    if (cliente_id || pipeline || statusId || cliente_nome) {
      const response = await cadastrarPortais({
        cliente_id: Number(cliente_id),
        pipeline_id: Number(pipeline),
        status_id: Number(statusId),
        nome: cliente_nome as string,
        type: statusSelelect.type,
      });

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
      setPipelineSelecionada("");
      setStatus([]);
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
      setStatusSelecionada("");
      setErrorMessage(null);
      const statusData = pipelines.find(
        (pipeline) => pipeline.id === id_pipeline
      )?.status;

      if (!statusData) {
        setPipelines([]);
        setLoadingPipelines(false);
        return;
      }

      setStatus(statusData);

      setLoadingStatus(false);
    } catch (error) {
      console.error("Erro ao buscar status:", error);
      setLoadingStatus(false);
    }
  }

  async function handleEditPortal() {
    if (!editFormRef.current) return;

    const formData = new FormData(editFormRef.current);
    const pipelineEdit = formData.get("pipelineEdit");
    const statusEdit = formData.get("statusEdit");
    const idEdit = editClienteSelecionado.id;
    const statusType = status.find((s) => s.id === Number(statusEdit))?.type;
    const response = await editarPortal(
      idEdit,
      Number(pipelineEdit),
      Number(statusEdit),
      Number(statusType)
    );

    if (!response.success) {
      console.log("Erro ao editar:", response.message);
      setErrorMessage(response.message || "Erro ao editar portal.");
      return;
    }

    toast.success("Tintim editado com sucesso!");
    fetchClientes();
    setEditClienteSelecionado({
      id: 0,
      nome: "",
      pipeline_id: 0,
      status_id: 0,
    });
    setPipelineSelecionada("");
    setStatusSelecionada("");
    setStatus([]);
    setPipelines([]);
    setLoadingPipelines(false);
    setClienteSelecionado("");
    // Resetando o formulário e fechando o modal
    setErrorMessage(null);
    modalEditRef.current?.close();
  }

  async function excluir(id: number) {
    const response = await excluirClientePortais(id);

    if (!response.success) {
      toast.error("Erro ao excluir pipeline.");
      return;
    }
    setPortais((prev) => prev.filter((portal) => portal.id !== id));

    toast.success("Portal excluido com sucesso!");
  }

  useEffect(() => {
    validationEdit();
  }, [pipelineSelecionada, statusSelecionada]);

  function validationEdit() {
    if (pipelineSelecionada === "" || statusSelecionada === "") {
      setValid(true);
    }
    if (
      editClienteSelecionado.pipeline_id === Number(pipelineSelecionada) &&
      editClienteSelecionado.status_id === Number(statusSelecionada)
    ) {
      setValid(true);
    } else {
      setValid(false);
    }
  }
  function buttons({
    id,
    nome,
    pipeline_id,
    status_id,
    id_cliente,
  }: {
    id: number;
    nome: string;
    pipeline_id: number;
    status_id: number;
    id_cliente: number;
  }) {
    return (
      <div className="flex gap-2 items-center justify-center">
        <ActionButton
          action={async () => {
            setEditClienteSelecionado({ id, nome, pipeline_id, status_id });
            modalEditRef.current?.showModal();
            const pipelinesCliente = await getPipelines(id_cliente);

            setPipelines(pipelinesCliente);
            setPipelineSelecionada(String(pipeline_id));
            const statusCliente = pipelinesCliente.find(
              (pipeline: { id: number }) => pipeline.id === pipeline_id
            );

            if (statusCliente) {
              setStatus(statusCliente.status);
            } else {
              setStatus([]);
            }
            setStatusSelecionada(status_id.toString());
            setLoadingPipelines(false);
          }}
          label={<FaEdit />}
        />
        <DeleteWarning onConfirm={() => excluir(id)} />
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col">
      {" "}
      {/* Alterado para flex-col */}
      <main className="flex-1 overflow-auto">
        {" "}
        {/* Adicionado overflow-auto */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Clientes com Portal</h1>
          <div className="flex items-center gap-2">
            <button
              className="btn btn-primary text-neutral"
              onClick={() => {
                navigate("/dashboard/portais/monitoramento");
              }}
            >
              <FaAlignRight className="w-4 h-4" />
            </button>
            <button
              className="btn btn-primary text-neutral"
              onClick={() => modalRef.current?.showModal()}
            >
              + Adicionar Portal
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table
            columns={["Cliente", "Funil", "Status", "Último Lead", "Ações"]}
            data={portaisData.map(
              ({
                id,
                nome,
                pipeline,
                status_pipeline,
                pipeline_id,
                status_id,
                id_cliente,
                data_ultimo_lead,
              }) => ({
                Cliente: nome,
                Funil: pipeline,
                Status: status_pipeline,
                UltimoLead: formatDateWithoutTimezone(data_ultimo_lead),
                Acoes: buttons({
                  id,
                  nome,
                  pipeline_id,
                  status_id,
                  id_cliente,
                }),
              })
            )}
          />
        </div>
      </main>
      <dialog ref={modalRef} className="modal ">
        <div className="modal-box  ">
          <h2 className="text-lg font-bold mb-4">
            <span className="text-primary">[ </span>
            Novo Portal
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
                      setStatusSelecionada("");
                    }}
                  >
                    <option value="" disabled>
                      Selecione um funil
                    </option>
                    {pipelines.map((pipeline) => (
                      <option key={pipeline.id} value={pipeline.id}>
                        {pipeline.nome}
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
      <dialog ref={modalEditRef} className="modal">
        <div className="modal-box">
          <h2 className="text-lg font-bold mb-4">
            <span className="text-primary">[ </span>
            Editar Portal
            <span className="text-primary"> ] </span>
          </h2>
          <form
            ref={editFormRef}
            onSubmit={(e) => {
              e.preventDefault();
              handleEditPortal();
            }}
            className="flex flex-col gap-4"
          >
            {/* Select de clientes */}
            <input
              name="clienteEdit"
              type="text"
              required
              className="input input-bordered w-full focus:outline-none"
              value={editClienteSelecionado.nome || ""}
              readOnly
            />

            {/* Select de funil */}

            {pipelines.length === 0 ? (
              <div className="skeleton h-10 w-full rounded-md"></div>
            ) : (
              <>
                <select
                  name="pipelineEdit"
                  required
                  className="select select-bordered w-full focus:outline-none"
                  value={pipelineSelecionada}
                  onChange={(e) => {
                    setPipelineSelecionada(e.target.value);
                    handleSearchPipeline(Number(e.target.value));
                  }}
                >
                  <option value="" disabled>
                    Selecione um funil
                  </option>

                  {pipelines.map((pipe) => (
                    <option key={pipe.id} value={pipe.id}>
                      {pipe.nome}
                    </option>
                  ))}
                </select>

                <select
                  name="statusEdit"
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
            )}

            <div className="modal-action">
              <button
                type="submit"
                disabled={valid}
                className="btn btn-success"
              >
                Salvar
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  // Resetando os valores e fechando o modal
                  setEditClienteSelecionado({
                    id: 0,
                    nome: "",
                    pipeline_id: 0,
                    status_id: 0,
                  });
                  modalEditRef.current?.close();
                  setPipelineSelecionada("");
                  setStatusSelecionada("");
                  setStatus([]);
                  setPipelines([]);
                  setLoadingPipelines(false);
                  setErrorMessage(null);
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
