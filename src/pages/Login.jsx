import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      console.log("Usuário logado:", user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro Firebase:", error.code, error.message);

      if (error.code === "auth/user-not-found") {
        setErro("Usuário não encontrado.");
      } else if (error.code === "auth/wrong-password") {
        setErro("Senha incorreta.");
      } else if (error.code === "auth/invalid-email") {
        setErro("Formato de e-mail inválido.");
      } else {
        setErro("Erro ao logar. Tente novamente.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Senha"
              className="input input-bordered w-full"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            {erro && <p className="text-error text-sm">{erro}</p>}

            <button type="submit" className="btn btn-primary w-full">
              Entrar
            </button>
            <button
              type="button"
              className="btn btn-secondary w-full"
              onClick={() => navigate("/register")}
            >
              Cadastrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}