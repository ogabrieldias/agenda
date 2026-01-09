import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase"; 
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    try {
      // Cria usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // Atualiza o perfil com o nome
      await updateProfile(user, { displayName: nome });

      // Salva dados extras no Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        nome: nome,
        email: email,
        createdAt: new Date()
      });

      setSucesso("Usuário cadastrado com sucesso!");
      setNome(""); setEmail(""); setSenha("");

      // Redireciona para login após cadastro
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        setErro("Usuário já cadastrado, cadastre um novo usuário.");
      } else if (error.code === "auth/weak-password") {
        setErro("A senha deve ter pelo menos 6 caracteres.");
      } else {
        setErro("Erro ao cadastrar. Tente novamente.");
      }
    }
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