import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:1212", // Substitua pelo endereço real da sua API
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
