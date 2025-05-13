import api from "./api";
import { AxiosError } from "axios";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return { ...response.data, success: true }; // Retorna o token
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || "Erro desconhecido na API",
      };
    } else {
      return {
        success: false,
        message: "Erro inesperado. Verifique a conexão com a API.",
      };
    }
  }
};

export const getClientes = async () => {
  try {
    const response = await api.get("/cliente/listar");
    return response.data.data; // Retorna a lista de clientes
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return [];
  }
};
export const getClientesPipeline = async (id: string | undefined) => {
  try {
    const response = await api.get(`/cliente/listarClientePipelines/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return [];
  }
};
export const getPipelines = async (id: string | undefined) => {
  try {
    const response = await api.get(`/cliente/listarPipelines/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return [];
  }
};
export const getClientePeloNome = async (cliente: string) => {
  try {
    const response = await api.get(`/cliente/listarPeloNome/${cliente}`);
    return response.data.data; // Retorna a lista de clientes
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return [];
  }
};

export const getClientePeloId = async (id: string) => {
  try {
    const response = await api.get(`/cliente/listarPeloId/${id}`);
    return response.data.data; // Retorna a lista de clientes
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return [];
  }
};

export const getUnidadesPorCliente = async (
  subdomain: string,
  token: string
) => {
  try {
    const response = await api.post(
      `/cliente/listarUnidades`,
      { subdomain, token }
    );
    return response.data.unidades; // Retorna a lista de clientes
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return [];
  }
};
export const getTintim = async () => {
  try {
    const response = await api.get("/cliente/listarTintim");
    return response.data.data; // Retorna a lista de clientes
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return [];
  }
};

export const cadastrarCliente = async (cliente: {
  nome: string;
  token: string;
}) => {
  try {
    console.log("Cadastrando cliente:", cliente);
    const response = await api.post("/cliente/cadastrar", cliente);
    return response.data; // Retorna o cliente cadastrado
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error);
    throw error;
  }
};

export const cadastrarTintim = async (unidade: {
  empresa_id: number;
  nome: string;
  todas_unidades: boolean;
}) => {
  try {
    console.log("Cadastrando cliente tintim:", unidade);
    const response = await api.post("/cliente/cadastrarUnidadeTintim", unidade);
    return response.data; // Retorna o cliente cadastrado
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || "Erro desconhecido na API",
      };
    } else {
      return {
        success: false,
        message: "Erro inesperado. Verifique a conexão com a API.",
      };
    }
  }
};

export const cadastrarClientePipeline = async (pipeline: {
  nome: string | undefined;
  cliente_id: number;
  pipeline_id: number;
}) => {
  try {
    console.log("Cadastrando Pipeline:", pipeline);
    const response = await api.post(
      "/cliente/cadastrarClientePipelines",
      pipeline
    );
    return {
      success: true,
      data: response.data,
      message: response.data.message || "Pipeline cadastrada com sucesso",
    }; // Retorna o cliente cadastrado
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || "Erro desconhecido na API",
      };
    } else {
      return {
        success: false,
        message: "Erro inesperado. Verifique a conexão com a API.",
      };
    }
  }
};

export const excluirCliente = async (id: number) => {
  try {
    const response = await api.delete("/cliente/excluir/" + id);
    return response; // Retorna a lista de clientes
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return [];
  }
};
export const excluirClientePipeline = async (id: number) => {
  try {
    const response = await api.delete("/cliente/excluirClientePipeline/" + id);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || "Erro desconhecido na API",
      };
    } else {
      return {
        success: false,
        message: "Erro inesperado. Verifique a conexão com a API.",
      };
    }
  }
};
