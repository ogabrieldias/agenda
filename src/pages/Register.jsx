import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SHA256 from "crypto-js/sha256"; // biblioteca para hash

export default function Register() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    // pega lista de usuários já cadastrados
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const emailNorm = email.trim().toLowerCase();
    const existe = usuarios.find((u) => u.email === emailNorm);

    if (existe) {
      setErro("Usuário já cadastrado, cadastre um novo usuário.");
      return;
    }

    // gera hash da senha
    const senhaHash = SHA256(senha).toString();

    // adiciona novo usuário
    const novoUsuario = { nome: nome.trim(), email: emailNorm, senha: senhaHash };
    usuarios.push(novoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    setSucesso("Usuário cadastrado com sucesso!");
    setNome(""); setEmail(""); setSenha("");

    // redireciona para login após cadastro
    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Cadastro</h2>

          <form onSubmit={handleRegister} className="space-y-3">
            <input
              type="text"
              placeholder="Nome"
              className="input input-bordered w-full"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
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
            {sucesso && <p className="text-success text-sm">{sucesso}</p>}

            <button type="submit" className="btn btn-primary w-full">
              Cadastrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
