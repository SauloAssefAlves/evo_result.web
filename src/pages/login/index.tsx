import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { submitTypes } from "./types";
import * as Yup from "yup";
import { useState } from "react";
import Alert from "../../components/Alert";
import { useNavigate } from "react-router";
import { login } from "../../services/clientesService";

const schema = Yup.object().shape({
  email: Yup.string().email("Email inválido").required("Email é obrigatório"),
  password: Yup.string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("Senha é obrigatória"),
});

export default function Login() {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState<{
    message: string | null;
    type: "success" | "error" | undefined;
  }>({ message: null, type: undefined });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: submitTypes) => {
    const { email, password } = data;

    const response = await login(email, password);

    console.log(response);

    if (!response.success) {
      setAlertMessage({ message: response.message, type: "error" });
      return;
    }

    if (response.token) {
      sessionStorage.setItem("authToken", response.token);
      console.log("Usuário logado com sucesso!");
      navigate("/dashboard");
    } else {
      console.error("Erro ao fazer login");
    }
  };

  const handleInputChange = () => {
    setAlertMessage({ message: null, type: undefined });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-300 to-primary-content p-4">
      <div className="w-full max-w-md">
        {/* Card Principal */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header com logo estilo original */}
          <div className="bg-black p-6 text-center">
            <h1 className="text-3xl font-bold text-yellow-400 mb-2 font-mono tracking-tight">
              <span className="text-white">[</span>evo
              <span className="text-white">]</span>result
            </h1>
            <p className="text-yellow-400/80 text-sm font-medium">
              Faça login para acessar o painel
            </p>
          </div>

          {/* Formulário */}
          <div className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Campo Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 placeholder:text-gray-400"
                    placeholder="Digite seu email"
                    onChange={handleInputChange}
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type="password"
                    {...register("password")}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 placeholder:text-gray-400"
                    placeholder="Digite sua senha"
                    onChange={handleInputChange}
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Botão de Login */}
              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-900 text-yellow-400 font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  Entrar
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </button>
            </form>

            {/* Links adicionais */}
            {/* <div className="mt-6 text-center space-y-3">
          <a
          href="#"
          className="text-sm text-gray-600 hover:text-black transition-colors"
          >
          Esqueceu sua senha?
          </a>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <span>Seguro</span>
          <span>•</span>
          <span>Privado</span>
          <span>•</span>
          <span>Confiável</span>
          </div>
        </div> */}
          </div>
        </div>

        {/* Indicador de carregamento (opcional) */}
        {/* {isLoading && (
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
      )} */}
      </div>

      {/* Alert Message */}
      {alertMessage.message && (
        <Alert message={alertMessage.message} type={alertMessage.type} />
      )}
    </div>
  );
}
