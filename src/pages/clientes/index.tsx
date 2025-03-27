import { useEffect, useState } from "react";
import Table from "../../components/Table";
import { getClientes } from "../../services/clientesService";

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

  useEffect(() => {
    const fetchClientes = async () => {
      const data = await getClientes();
      setClientes(data);
    };

    fetchClientes();
    console.log(clientes);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Conteúdo principal */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Lista de Clientes</h1>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <Table
            columns={["ID", "Nome"]}
            data={clientes.map(({ id, nome }) => ({
              ID: id,
              Nome: nome,
            }))}
          />
        </div>
      </main>
    </div>
  );
}
