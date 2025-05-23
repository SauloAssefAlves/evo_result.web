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
} from "../../services/clientesService";
import { FaCopy } from "react-icons/fa";
import DeleteWarning from "../../components/DeleteWarning";

export default function Tintim() {
  const [tintimData, setTintimData] = useState([]);
  const [clientes, setClientes] = useState<{ id: string; nome: string }[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [unidades, setUnidades] = useState<{ id: string; value: string }[]>([]);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState("");
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [loadingUnidades, setLoadingUnidades] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const fetchClientes = async () => {
    const data = await getTintim();
    setTintimData(data);
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

  const handleAddTintim = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const cliente = formData.get("cliente");
    let unidade = formData.get("unidade");
    if (!unidade) {
      unidade = "todas";
    }

    const empresa_id = cliente;
    const nome = unidade;
    const todas_unidades = unidade === "todas";
    console.log("Cliente:", todas_unidades);

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
      const updatedClientes = clientes.filter((cliente) => cliente.id !== id.toString());
      setClientes(updatedClientes);
    }

  function buttons(id: string, unidade_formatada: string) {
    return (
      <div className="flex gap-2 items-center justify-center">
        <button
          className="btn btn-neutral "
          onClick={() => {
            // Função para deletar o tintim
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
        >
          <FaCopy />
        </button>
        <DeleteWarning onConfirm={()=> excluirTintim(Number(id))}/>
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
            + Adicionar Tintim
          </button>
        </div>

        <div className="overflow-x-auto">
          <Table
            columns={["Cliente", "Unidade", "Ações"]}
            data={tintimData.map(
              ({
                id,
                cliente,
                unidade,
                todas_unidades,
                unidade_formatada,
              }) => ({
                Cliente: cliente,
                Unidade: todas_unidades ? "Todas" : unidade,
                Ações: buttons(id, unidade_formatada),
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
    </div>
  );
}
