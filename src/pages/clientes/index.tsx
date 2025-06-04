import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Table from "../../components/Table";
import {
  cadastrarCliente,
  editarCliente,
  excluirCliente,
  getClientes,
} from "../../services/clientesService";
import { FaFilter } from "react-icons/fa6";
import { FaEdit, FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { useNavigate } from "react-router";

import DeleteWarning from "../../components/DeleteWarning";

export default function Clientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<
    Array<{
      id: number;
      automotivo: boolean;
      nome: string;
      tintim: boolean;
      token: string;
    }>
  >([]);
  const [editClient, setEditClient] = useState<{
    id: number;
    nome: string;
    token: string;
    automotivo: boolean;
  } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const formEditRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const modalEditRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const fetchClientes = async () => {
      const data = await getClientes();
      setClientes(data);
      console.log("Clientes carregados:", data);
    };

    fetchClientes();
  }, []);

  async function excluir(id: number) {
    await excluirCliente(id);
    toast.success("Cliente excluído com sucesso!");
    const updatedClientes = clientes.filter((cliente) => cliente.id !== id);
    setClientes(updatedClientes);
  }

  function Buttons(
    id: number,
    nome: string,
    token: string,
    automotivo: boolean
  ) {
    return (
      <div className="flex gap-2 items-center justify-center">
        <button
          className="btn btn-neutral"
          onClick={() => {
            setEditClient({ id, nome, token, automotivo });
            modalEditRef.current?.showModal();
          }}
        >
          <FaEdit />
        </button>
        <button
          className="btn btn-neutral"
          onClick={() => {
            navigate(`/dashboard/clientes/${id}/pipelines`); // Redireciona para a página do cliente
          }}
        >
          <FaFilter />
        </button>
        <DeleteWarning onConfirm={() => excluir(id)} />
      </div>
    );
  }
  const handleAddCliente = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const novoCliente = {
      nome: formData.get("nome") as string,
      token: formData.get("token") as string,
      automotivo: formData.get("automotivo") === "true" ? true : false,
    };

    console.log("Cliente a ser adicionado:", novoCliente);
    await cadastrarCliente(novoCliente);

    toast.success("Cliente cadastrado com sucesso!");

    const data = await getClientes();
    setClientes(data);

    if (formRef.current) {
      formRef.current.reset();
    }

    modalRef.current?.close();
  };

  const handleEditCliente = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedCliente = {
      id: editClient?.id || 0,
      nome: formData.get("nome") as string,
      token: formData.get("token") as string,
      automotivo: formData.get("automotivo") === "true" ? true : false,
    };

    if (
      updatedCliente.nome === editClient?.nome &&
      updatedCliente.token === editClient?.token &&
      updatedCliente.automotivo === editClient?.automotivo
    ) {
      toast.info("Nenhuma alteração foi feita.");
      modalEditRef.current?.close();
      return;
    }

    console.log("Cliente a ser editado:", updatedCliente);
    await editarCliente(
      updatedCliente.id,
      updatedCliente.nome,
      updatedCliente.token,
      updatedCliente.automotivo
    );

    toast.success("Cliente editado com sucesso!");

    const data = await getClientes();
    setClientes(data);
    setEditClient(null);
    modalEditRef.current?.close();
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
            columns={["Nome", "Automotivo", "Ações"]}
            data={clientes.map(({ nome, id, token, automotivo }) => ({
              Nome: nome,
              Automotivo: automotivo ? (
                <FaCheck className="text-success text-xl" />
              ) : (
                <ImCross className="text-error" />
              ),
              Ações: Buttons(id, nome, token, automotivo),
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
            <span className="text-xs text-warning">
              * O nome do cliente precisa ser igual ao da url do Kommo
            </span>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">
                O cliente é automotivo?
              </span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="automotivo"
                    value="true"
                    className="radio"
                    required
                  />
                  Sim
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="automotivo"
                    value="false"
                    className="radio"
                    required
                  />
                  Não
                </label>
              </div>
            </div>
            <textarea
              name="token"
              placeholder="Token"
              className="input input-bordered w-full h-24 focus:outline-none break-all whitespace-pre-wrap"
              required
            />
            <span className="text-xs text-warning">
              * Gere um token de longa duração nas configurações do kommo e
              coloque aqui.
            </span>
            <div className="modal-action">
              <button type="submit" className="btn btn-success">
                Salvar
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  if (formRef.current) {
                    formRef.current.reset();
                  }
                  modalRef.current?.close();
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </dialog>
      {/* Modal de Editar Cliente */}

      <dialog ref={modalEditRef} className="modal">
        <div className="modal-box">
          <h2 className="text-lg font-bold mb-4">
            <span className="text-primary">[ </span>
            Editar Cliente
            <span className="text-primary"> ] </span>
          </h2>
          {editClient && (
            <form
              ref={formEditRef}
              onSubmit={(e) => handleEditCliente(e)}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                name="nome"
                placeholder="Nome do Cliente"
                className="input input-bordered w-full focus:outline-none"
                defaultValue={editClient?.nome || ""}
              />
              <span className="text-xs text-warning">
                * O nome do cliente precisa ser igual ao da url do Kommo.
              </span>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">
                  O cliente é automotivo?
                </span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="automotivo"
                      value="true"
                      className="radio"
                      required
                      defaultChecked={editClient?.automotivo === true}
                    />
                    Sim
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="automotivo"
                      value="false"
                      className="radio"
                      required
                      defaultChecked={editClient?.automotivo === false}
                    />
                    Não
                  </label>
                </div>
              </div>
              <textarea
                name="token"
                placeholder="Token"
                className="input input-bordered w-full  h-24 focus:outline-none break-all  whitespace-pre-wrap"
                defaultValue={editClient?.token || ""}
              />
              <span className="text-xs text-warning">
                * Token de longa duração do Kommo.
              </span>
              <div className="modal-action">
                <button type="submit" className="btn btn-success">
                  Editar
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    if (formEditRef.current) {
                      formEditRef.current.reset();
                    }
                    modalEditRef.current?.close();
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </div>
  );
}
