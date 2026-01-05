import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SHA256 from "crypto-js/sha256";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro("");

    // pega lista de usuários cadastrados
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const emailNorm = email.trim().toLowerCase();
    const senhaHash = SHA256(senha).toString(); // gera hash da senha digitada

    // procura usuário
    const usuario = usuarios.find(
      (u) => u.email === emailNorm && u.senha === senhaHash
    );

    if (usuario) {
      localStorage.setItem("token", "fake-token"); // marca login
      navigate("/dashboard");
      window.location.reload(); // força Navbar a re-renderizar
    } else {
      setErro("Usuário ou senha incorretos. Tente novamente.");
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
            {/* <button
              type="button"
              onClick={() => localStorage.removeItem("usuarios")}
              className="btn btn-error w-full"
            >
              Excluir todos os usuários
            </button> */}
          </form>
        </div>
      </div>
    </div>
  );
}
