import { useEffect, useState, useRef, SetStateAction } from "react";
import { toast } from "react-toastify";
import Table from "../../components/Table";
import {
  getTintim,
  getClientes,
  getClientePeloId,
  getUnidadesPorCliente,
  cadastrarTintim,
  excluirClienteTintim,
  editarTintim,
} from "../../services/clientesService";
import { FaCopy, FaEdit, FaAlignRight } from "react-icons/fa";
import DeleteWarning from "../../components/DeleteWarning";
import { ActionButton } from "../../components/ActionButton";
import { useNavigate } from "react-router";
import { formatDateWithoutTimezone } from "../../utils/dateFormater";
import Filter, { FilterInput } from "../../components/Filter";

export default function Tintim() {
  const [tintimData, setTintimData] = useState<
    {
      cliente: string;
      id: number;
      todas_unidades: boolean;
      unidade: string;
      unidade_formatada: string;
      data_ultimo_tintim: string;
    }[]
  >([]);
  const [clientes, setClientes] = useState<
    { id: string; nome: string; token: string }[]
  >([]);
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [unidades, setUnidades] = useState<{ id: string; value: string }[]>([]);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState("");
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [loadingUnidades, setLoadingUnidades] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editCliente, setEditCliente] = useState<{
    cliente?: string;
    id?: number;
    todas_unidades?: boolean;
    unidade?: string;
    unidade_formatada?: string;
  }>({});
  const [editUnidades, setEditUnidades] = useState<
    { id: string; value: string }[]
  >([]);
  const [editUnidadeSelecionada, setEditUnidadeSelecionada] = useState("");
  const [optionsEmpresas, setOptionsEmpresas] = useState<
    { label: string; value: string }[]
  >([]);

  const [data, setData] = useState<
    {
      cliente: string;
      id: number;
      todas_unidades: boolean;
      unidade: string;
      unidade_formatada: string;
      data_ultimo_tintim: string;
    }[]
  >([]);

  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const modalEditRef = useRef<HTMLDialogElement>(null);
  const fetchClientes = async () => {
    const data = await getTintim();
    setData(data);

    setTintimData(data);
  };
  useEffect(() => {
    fetchClientes();
    console.log("Tintim data fetched:", tintimData);
  }, []);

  useEffect(() => {
    const fetchTodosClientes = async () => {
      setLoadingClientes(true);
      const clientesData = await getClientes();
      console.log("Clientes data fetched:", clientesData);
      setClientes(clientesData);
      setOptionsEmpresas(
        clientesData.map((clientes: { nome: any }) => ({
          label: clientes.nome,
          value: clientes.nome,
        }))
      );

      setLoadingClientes(false);
    };
    console.log("Options Empresas:", optionsEmpresas);
    fetchTodosClientes();
  }, []);

  const handleAddTintim = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const cliente = clienteSelecionado;
    let unidade = formData.get("unidade");

    if (!unidade) {
      unidade = "todas";
    }

    const empresa_id = cliente;

    const nome = unidade === "todas" ? cliente : unidade;
    console.log("Nome do Tintim:", nome);
    const todas_unidades = unidade === "todas";

    const response = await cadastrarTintim({
      empresa_id: Number(empresa_id),
      nome: nome as string,
      todas_unidades,
    });

    if (!response.success) {
      setErrorMessage(response.message || "Erro ao cadastrar Tintim.");
      return;
    }

    toast.success("Tintim cadastrado com sucesso!");
    fetchClientes();
    setErrorMessage(null);
    modalRef.current?.close();
    setClienteSelecionado("");
    setUnidades([]);
    setLoadingUnidades(false);
  };

  const handleEditTintim = async (
    event: { preventDefault: () => void },
    id: number
  ) => {
    event.preventDefault();

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const cliente = editCliente.cliente;
    let unidade = formData.get("unidadeEdit");

    if (!unidade) {
      unidade = "todas";
    }
    const nome = unidade === "todas" ? cliente : unidade;
    const todas_unidades = unidade === "todas";

    const response = await editarTintim(id, nome as string, todas_unidades);

    if (!response.success) {
      setErrorMessage(response.message || "Erro ao editar Tintim.");
      return;
    }

    toast.success("Tintim editado com sucesso!");
    fetchClientes();
    setErrorMessage(null);
    modalEditRef.current?.close();
    setEditCliente({});
    setEditUnidades([]);
    setEditUnidadeSelecionada("");
  };

  const handleSearchCliente = async (id_cliente: SetStateAction<string>) => {
    try {
      setClienteSelecionado(id_cliente);
      setLoadingUnidades(true);
      setErrorMessage(null);

      if (!id_cliente) {
        setUnidades([]);
        setLoadingUnidades(false);
        return;
      }

      const [encontrado] = await getClientePeloId(id_cliente as string);

      if (encontrado) {
        const unidadesCliente = await getUnidadesPorCliente(
          encontrado.nome,
          encontrado.token
        );
        setUnidades(unidadesCliente);
      } else {
        setUnidades([]);
      }

      setLoadingUnidades(false);
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      setLoadingUnidades(false);
    }
  };

  async function excluirTintim(id: number) {
    await excluirClienteTintim(id);
    toast.success("Tintim excluído com sucesso!");
    const updatedClientesTintim = tintimData.filter(
      (tintim) => tintim.id !== id
    );
    setTintimData(updatedClientesTintim);
  }

  function buttons(id: number, unidade_formatada: string) {
    return (
      <div className="flex gap-2 items-center justify-center">
        <ActionButton
          action={() => {
            navigator.clipboard
              .writeText(
                "http://89.116.186.230:1212/tintimWebhook/" + unidade_formatada
              )
              .then(() => {
                toast.success("Link copiado para a área de transferência!");
              })
              .catch((err) => {
                console.error(
                  "Erro ao copiar para a área de transferência:",
                  err
                );
                toast.error("Erro ao copiar o link.");
              });
          }}
          label={<FaCopy />}
        />
        <ActionButton
          action={async () => {
            setLoadingUnidades(true);
            const clienteSelecionadoTintim = tintimData.find(
              (tintim) => tintim.id === id
            );
            if (!clienteSelecionadoTintim) {
              toast.error("Tintim não encontrado.");
              return;
            }

            const clienteSelecionado = clientes.find(
              (cliente) => cliente.nome === clienteSelecionadoTintim.cliente
            );

            if (clienteSelecionado) {
              modalEditRef.current?.showModal();
              setEditCliente(clienteSelecionadoTintim);
              setEditUnidadeSelecionada(
                clienteSelecionadoTintim.unidade_formatada
              );
              const unidades = await getUnidadesPorCliente(
                clienteSelecionado.nome,
                clienteSelecionado.token
              );
              setLoadingUnidades(false);
              if (unidades.length === 0) {
                setEditUnidades([]);
              }
              setEditUnidades(unidades);
            }
          }}
          label={<FaEdit />}
        ></ActionButton>
        <DeleteWarning onConfirm={() => excluirTintim(Number(id))} />
      </div>
    );
  }
  function validationEdit() {
    if (editUnidadeSelecionada === editCliente.unidade_formatada) {
      return true;
    }
    return false;
  }

  const inputs: FilterInput[] = [
    {
      label: "Cliente TinTim",
      type: "select",
      name: "cliente",
      options: optionsEmpresas,
    },
    {
      label: "Último Tintim",
      type: "date-range",
      name: "periodo",
    },
  ];

  function handleFilterSubmit(filterData: Record<string, string>) {
    if (
      (!filterData.cliente || filterData.cliente === "") &&
      (!filterData.periodo ||
        filterData.periodo === "" ||
        (Array.isArray(filterData.periodo) && filterData.periodo.length === 0))
    ) {
      fetchClientes();
      // Recarrega todos os dados
      return;
    }

    let filtered = [...data];

    // Filtro por cliente (case insensitive)
    if (filterData.cliente && filterData.cliente !== "") {
      filtered = filtered.filter(
        (item) =>
          item.cliente &&
          item.cliente.toLowerCase().includes(filterData.cliente.toLowerCase())
      );
    }

    // Filtro por período (date-range)
    if (
      filterData.periodo &&
      Array.isArray(filterData.periodo) &&
      filterData.periodo.length === 2 &&
      filterData.periodo[0] &&
      filterData.periodo[1]
    ) {
      const [start, end] = filterData.periodo as unknown as [string, string];
      const startDate = new Date(start);
      const endDate = new Date(end);

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.data_ultimo_tintim);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }
    console.log("Dados filtrados:", filtered);
    setTintimData(filtered);
  }

  return (
    <div className="flex h-full flex-col">
      {" "}
      {/* Alterado para flex-col */}
      <main className="flex-1 overflow-auto">
        {" "}
        {/* Adicionado overflow-auto */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl text-base-content font-bold">
            Clientes com TinTim
          </h1>
          <div className="flex items-center gap-2">
            <button
              className="btn btn-primary text-primary-content"
              onClick={() => {
                navigate("/dashboard/tintim/monitoramento");
              }}
            >
              <FaAlignRight className="w-4 h-4" />
            </button>
            <button
              className="btn btn-primary text-primary-content"
              onClick={() => modalRef.current?.showModal()}
            >
              + Adicionar Tintim
            </button>
          </div>
        </div>
        <div className="w-full">
          {" "}
          <Filter onSubmit={handleFilterSubmit} inputs={inputs} />
        </div>
        <div className="overflow-x-auto">
          <Table
            columns={[
              { name: "Cliente", sortType: "string" as const },
              { name: "Unidade", sortable: false },
              { name: "Último Tintim", sortType: "datetime" as const },
              { name: "Ações", sortable: false },
            ]}
            data={tintimData.map(
              ({
                id,
                cliente,
                todas_unidades,
                unidade_formatada,
                data_ultimo_tintim,
              }) => ({
                Cliente: cliente,
                Unidade: todas_unidades ? "Todas" : unidade_formatada,
                UltimoTintim: formatDateWithoutTimezone(data_ultimo_tintim),
                Acoes: buttons(id, unidade_formatada),
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
            onSubmit={handleAddTintim}
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

            {/* Select de unidades com Skeleton */}
            {loadingUnidades ? (
              <div className="skeleton h-10 w-full rounded-md"></div>
            ) : (
              unidades.length > 0 && (
                <>
                  <select
                    name="unidade"
                    required
                    className="select select-bordered w-full focus:outline-none"
                    value={unidadeSelecionada}
                    onChange={(e) => {
                      setErrorMessage(null);
                      setUnidadeSelecionada(e.target.value);
                    }}
                  >
                    <option value="" disabled>
                      Selecione uma unidade
                    </option>
                    <option value="todas">Todas</option>
                    {unidades.map((unidade) => (
                      <option key={unidade.id} value={unidade.value}>
                        {unidade.value || ""}
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
                  setUnidades([]);
                  setLoadingUnidades(false);
                  setErrorMessage(null);
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
            Editar Tintim
            <span className="text-primary"> ] </span>
          </h2>
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              handleEditTintim(e, editCliente.id as number);
            }}
            className="flex flex-col gap-4"
          >
            {/* Select de clientes */}
            <input
              name="clienteEdit"
              type="text"
              required
              className="input input-bordered w-full focus:outline-none"
              value={editCliente.cliente || ""}
              readOnly
            />

            {/* Select de unidades */}

            {loadingUnidades ? (
              <div className="skeleton h-10 w-full rounded-md"></div>
            ) : (
              <select
                name="unidadeEdit"
                required
                className="select select-bordered w-full focus:outline-none"
                value={editUnidadeSelecionada}
                onChange={(e) => {
                  setEditUnidadeSelecionada(e.target.value);
                }}
              >
                <option value="" disabled>
                  Selecione uma unidade
                </option>
                <option value="todas">Todas</option>
                {editUnidades.map((unidade) => (
                  <option key={unidade.id} value={unidade.value}>
                    {unidade.value || ""}
                  </option>
                ))}
              </select>
            )}

            <div className="modal-action">
              <button
                type="submit"
                disabled={validationEdit()}
                className="btn btn-success"
              >
                Salvar
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  // Resetando os valores e fechando o modal
                  setEditUnidades([]);
                  setEditUnidadeSelecionada("");
                  modalEditRef.current?.close();
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
