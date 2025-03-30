import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Table from "../../components/Table";
import { cadastrarCliente, getClientes } from "../../services/clientesService";

export default function Clientes() {
  const [clientes, setClientes] = useState<
    Array<{
      id: number;
      lookerstudio: boolean;
      nome: string;
      tintim: boolean;
      token: string;
    }>
  >([]);
  const formRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const fetchClientes = async () => {
      const data = await getClientes();
      setClientes(data);
    };

    fetchClientes();
  }, []);

  const handleAddCliente = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const novoCliente = {
      nome: formData.get("nome") as string,
      token: formData.get("token") as string,
    };

    console.log("Cliente a ser adicionado:", novoCliente);
    // Aqui você pode chamar a API para cadastrar o cliente
    await cadastrarCliente(novoCliente);

    toast.success("Cliente cadastrado com sucesso!");

    if (formRef.current) {
      formRef.current.reset();
    }

    modalRef.current?.close(); // Fecha o modal após o cadastro
  };

  return (
    <div className="flex h-screen">
      {/* Conteúdo principal */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Lista de Clientes</h1>
          <button
            className="btn btn-primary text-neutral"
            onClick={() => modalRef.current?.showModal()}
          >
            + Adicionar Cliente
          </button>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <Table
            columns={["Nome"]}
            data={clientes.map(({ nome }) => ({
              Nome: nome,
            }))}
          />
        </div>
      </main>

      {/* Modal de Adicionar Cliente */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h2 className="text-lg font-bold mb-4">
            <span className="text-primary">[ </span>
            Novo Cliente
            <span className="text-primary"> ] </span>
          </h2>
          <form
            ref={formRef}
            onSubmit={handleAddCliente}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              name="nome"
              placeholder="Nome do Cliente"
              className="input input-bordered w-full focus:outline-none"
              required
            />
            <textarea
              name="token"
              placeholder="Token"
              className="input input-bordered w-full  h-24 focus:outline-none"
              required
            />
            <div className="modal-action">
              <button type="submit" className="btn btn-success">
                Salvar
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
