import { useState, useEffect } from "react";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [erro, setErro] = useState("");
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    const dadosClientes = localStorage.getItem("clientes");
    if (dadosClientes) setClientes(JSON.parse(dadosClientes));
  }, []);

  useEffect(() => {
    localStorage.setItem("clientes", JSON.stringify(clientes));
  }, [clientes]);

  // Função para aplicar máscara no telefone no formato +55 XX XXXXX-XXXX
  const formatarTelefone = (valor) => {
    let numeros = valor.replace(/\D/g, "");

    if (!numeros.startsWith("55")) {
      numeros = "55" + numeros;
    }

    numeros = numeros.slice(0, 13);

    if (numeros.length >= 12) {
      return `+55 ${numeros.slice(2, 4)} ${numeros.slice(4, 9)}-${numeros.slice(9, 13)}`;
    }

    return "+55 " + numeros.slice(2);
  };

  const salvarCliente = (e) => {
    e.preventDefault();
    setErro("");

    if (!nome.trim() || !telefone.trim() || !email.trim()) {
      setErro("Nome, Telefone e Email são obrigatórios.");
      return;
    }

    const telefoneLimpo = telefone.replace(/\D/g, "");
    const numeroSemCodigo = telefoneLimpo.startsWith("55")
      ? telefoneLimpo.slice(2)
      : telefoneLimpo;

    if (numeroSemCodigo.length < 10 || numeroSemCodigo.length > 11) {
      setErro("Telefone deve ter 10 ou 11 dígitos.");
      return;
    }

    if (editando) {
      const atualizados = clientes.map((c) =>
        c.id === editando
          ? { ...c, nome, telefone, email, observacoes }
          : c
      );
      setClientes(atualizados);
      setEditando(null);
    } else {
      const novo = { id: Date.now(), nome, telefone, email, observacoes };
      setClientes([...clientes, novo]);
    }

    setNome("");
    setTelefone("");
    setEmail("");
    setObservacoes("");
  };

  const removerCliente = (id) => {
    setClientes(clientes.filter((c) => c.id !== id));
  };

  const editarCliente = (cliente) => {
    setNome(cliente.nome);
    setTelefone(cliente.telefone);
    setEmail(cliente.email);
    setObservacoes(cliente.observacoes || "");
    setEditando(cliente.id);
  };

  const cancelarEdicao = () => {
    setEditando(null);
    setNome("");
    setTelefone("");
    setEmail("");
    setObservacoes("");
    setErro("");
  };

  // Estados para o filtro
  const [filtroCampo, setFiltroCampo] = useState("nome");   // campo padrão
  const [filtroValor, setFiltroValor] = useState("");       // valor digitado


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Cadastro de Clientes</h1>

      <form onSubmit={salvarCliente} className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="input input-bordered w-full"
        />
        <input
          type="tel"
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
          maxLength={17}
          className="input input-bordered w-full"
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered w-full"
        />

        <textarea
          placeholder="Observações"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          className="textarea textarea-bordered w-full"
        />

        {erro && <p className="text-error text-sm">{erro}</p>}

        <button type="submit" className="btn btn-primary w-full">
          {editando ? "Atualizar Cliente" : "Salvar Cliente"}
        </button>

        {editando && (
          <button
            type="button"
            className="btn btn-secondary w-full mt-2"
            onClick={cancelarEdicao}
          >
            Voltar
          </button>
        )}
      </form>

      <h2 className="text-xl font-semibold mb-3">Lista de Clientes</h2>
      <div className="flex gap-2 mb-4">
        <select
          value={filtroCampo}
          onChange={(e) => setFiltroCampo(e.target.value)}
          className="select select-bordered"
        >
          <option value="nome">Nome</option>
          <option value="telefone">Telefone</option>
          <option value="email">Email</option>
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
        {clientes
          .filter((c) => {
            switch (filtroCampo) {
              case "nome":
                return c.nome.toLowerCase().includes(filtroValor);
              case "telefone":
                return c.telefone.toLowerCase().includes(filtroValor);
              case "email":
                return c.email.toLowerCase().includes(filtroValor);
              default:
                return true;
            }
          })
          .map((c) => (
            <li
              key={c.id}
              className="flex justify-between items-center p-3 bg-base-200 rounded"
            >
              <span>
                {c.nome} — {c.telefone} — {c.email}
                <br />
                Observações: {c.observacoes}
              </span>
              <div className="space-x-2">
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => editarCliente(c)}
                >
                  Editar
                </button>
                {!editando && (
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => removerCliente(c.id)}
                  >
                    Remover
                  </button>
                )}
              </div>
            </li>
          ))}
      </ul>

    </div>
  );
}
