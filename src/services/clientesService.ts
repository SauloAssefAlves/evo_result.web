import api from "./api";

export const getClientes = async () => {
  try {
    const response = await api.get("/cliente/listar");
    return response.data.data; // Retorna a lista de clientes
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return [];
  }
};

// export const cadastrarCliente = async (cliente: {
//   nome: string;
//   email: string;
// }) => {
//   try {
//     const response = await api.post("/clientes", cliente);
//     return response.data; // Retorna o cliente cadastrado
//   } catch (error) {
//     console.error("Erro ao cadastrar cliente:", error);
//     throw error;
//   }
// };
