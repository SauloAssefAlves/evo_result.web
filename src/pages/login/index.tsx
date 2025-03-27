import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { submitTypes } from "./types";
import * as Yup from "yup";
import { useState } from "react";
import Alert from "../../components/Alert";
import { useNavigate } from "react-router";

// const mock = {
//   email: "saulo@email.com",
//   password: "123456",
// };

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

  const onSubmit = (data: submitTypes) => {
    // if (data.email !== mock.email || data.password !== mock.password) {
    //   setAlertMessage({ message: "Email ou senha inválidos", type: "error" });
    //   return;
    // }
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200">
      <div className="w-full max-w-md p-8 bg-gray-100 rounded-2xl shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">
            evo <span className="text-amber-400">result</span>
          </h1>
        </div>
        <p className="text-center text-gray-700 mb-6">
          Faça login para acessar o painel
        </p>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-black font-semibold">Email</span>
            </label>
            <input
              type="email"
              {...register("email")}
              className="input input-bordered w-full focus:outline-0"
              placeholder="Digite seu email"
            />
            {errors.email && (
              <p className="text-red-500 font-light text-xs">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-black font-semibold">Senha</span>
            </label>
            <input
              type="password"
              {...register("password")}
              className="input input-bordered w-full focus:outline-0"
              placeholder="Digite sua senha"
            />
            {errors.password && (
              <p className="text-red-500 font-light text-xs">
                {errors.password.message}
              </p>
            )}
          </div>

          <button type="submit" className="btn btn-primary group   w-full">
            Login
          </button>
        </form>
      </div>
      {alertMessage.message && (
        <Alert message={alertMessage.message} type={alertMessage.type} />
      )}
    </div>
  );
}
