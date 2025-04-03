import axios from "axios";


const url = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: url, // Substitua pelo endereço real da sua API
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

// Adiciona um interceptor de resposta para capturar erros de autenticação
api.interceptors.response.use(
  (response) => response, // Se a resposta for bem-sucedida, apenas retorna
  (error) => {
    console.error("Erro na requisição:", error);
    if (error.response && error.response.status === 403) {
      // Se o status for 401 (não autorizado), redireciona para o login
      window.location.href = "/"; // Altere conforme sua rota de login
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
