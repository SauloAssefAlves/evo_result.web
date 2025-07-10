import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { submitTypes } from "./types";
import * as Yup from "yup";
import { useState } from "react";
import Alert from "../../components/Alert";
import { useNavigate } from "react-router";
import { login } from "../../services/clientesService";
import logoEVO from "../../assets/logoEVO.png";

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
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Logo */}
          {/* <div className="flex justify-center mb-6">
            <img src={logoEVO} alt="EVO Result" className="h-20 w-auto" />
          </div> */}

          {/* Título */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-base-content">Bem-vindo</h1>
            <p className="text-base-content/70 mt-2">
              Faça login para continuar
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Campo Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text pb-1">Email</span>
              </label>
              <input
                type="email"
                {...register("email")}
                className="input input-bordered w-full focus:outline-0"
                placeholder="Digite seu email"
                onChange={handleInputChange}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.email.message}
                  </span>
                </label>
              )}
            </div>

            {/* Campo Senha */}
            <div className="form-control">
              <label className="label">
                <span className="label-text pb-1">Senha</span>
              </label>
              <input
                type="password"
                {...register("password")}
                className="input input-bordered w-full focus:outline-0"
                placeholder="Digite sua senha"
                onChange={handleInputChange}
              />
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.password.message}
                  </span>
                </label>
              )}
            </div>

            {/* Link Esqueceu a senha */}
            {/* <div className="text-right">
              <a href="#" className="link link-primary text-sm">
                Esqueceu a senha?
              </a>
            </div> */}

            {/* Botão Login */}
            <div className="form-control mt-6 w-full">
              <button type="submit" className="btn btn-primary w-full">
                Entrar
              </button>
            </div>

            {/* Divider */}
            {/* <div className="divider">ou</div> */}

            {/* Link Criar conta */}
            {/* <div className="text-center">
              <p className="text-base-content/70">
                Não tem uma conta?{" "}
                <a href="#" className="link link-primary">
                  Criar conta
                </a>
              </p>
            </div> */}
          </form>
        </div>
      </div>

      {/* Alert Message */}
      {alertMessage.message && (
        <Alert message={alertMessage.message} type={alertMessage.type} />
      )}
    </div>
  );
}
