import { useState, useEffect } from "react";

export default function Profissionais() {
  const [profissionais, setProfissionais] = useState([]);
  const [nome, setNome] = useState("");
  const [especialidade, setEspecialidade] = useState("");

  useEffect(() => {
    const dados = localStorage.getItem("profissionais");
    if (dados) setProfissionais(JSON.parse(dados));
  }, []);

  useEffect(() => {
    localStorage.setItem("profissionais", JSON.stringify(profissionais));
  }, [profissionais]);

  const salvarProfissional = (e) => {
    e.preventDefault();
    if (!nome.trim()) return;
    const novo = { id: Date.now(), nome, especialidade };
    setProfissionais([...profissionais, novo]);
    setNome(""); setEspecialidade("");
  };

  const removerProfissional = (id) => {
    setProfissionais(profissionais.filter(p => p.id !== id));
  };

  // Estado para filtro
  const [filtroCampo, setFiltroCampo] = useState("nome");   // campo padrão
  const [filtroValor, setFiltroValor] = useState("");       // valor digitado


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Profissionais</h1>
      <form onSubmit={salvarProfissional} className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="input input-bordered w-full"
        />
        <input
          type="text"
          placeholder="Especialidade"
          value={especialidade}
          onChange={(e) => setEspecialidade(e.target.value)}
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary w-full">Salvar</button>
      </form>

      <h2 className="text-xl font-semibold mb-3">Lista de Profissionais</h2>
      <div className="flex gap-2 mb-4">
        <select
          value={filtroCampo}
          onChange={(e) => setFiltroCampo(e.target.value)}
          className="select select-bordered"
        >
          <option value="nome">Nome</option>
          <option value="especialidade">Especialidade</option>
        </select>

        <input
          type="text"
          placeholder={`Pesquisar por ${filtroCampo}...`}
          className="input input-bordered flex-1"
          value={filtroValor}
          onChange={(e) => setFiltroValor(e.target.value.toLowerCase())}
        />
      </div>

      <ul className="space-y-2">
        {profissionais
          .filter((p) => {
            switch (filtroCampo) {
              case "nome":
                return p.nome.toLowerCase().includes(filtroValor);
              case "especialidade":
                return p.especialidade.toLowerCase().includes(filtroValor);
              default:
                return true;
            }
          })
          .map((p) => (
            <li key={p.id} className="flex justify-between items-center p-2 bg-base-200 rounded">
              <span>{p.nome} — {p.especialidade}</span>
              <button className="btn btn-error btn-sm" onClick={() => removerProfissional(p.id)}>Remover</button>
            </li>
          ))}
      </ul>

    </div>
  );
}
