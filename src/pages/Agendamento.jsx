import { useState, useEffect } from "react";

export default function Agendamento() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [profissionalId, setProfissionalId] = useState("");
  const [servicoId, setServicoId] = useState("");
  const [status, setStatus] = useState("pendente"); // novo campo
  const [clientes, setClientes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const dadosAgendamentos = localStorage.getItem("agendamentos");
    if (dadosAgendamentos) setAgendamentos(JSON.parse(dadosAgendamentos));

    const dadosClientes = localStorage.getItem("clientes");
    if (dadosClientes) setClientes(JSON.parse(dadosClientes));

    const dadosProfissionais = localStorage.getItem("profissionais");
    if (dadosProfissionais) setProfissionais(JSON.parse(dadosProfissionais));

    const dadosServicos = localStorage.getItem("servicos");
    if (dadosServicos) setServicos(JSON.parse(dadosServicos));
  }, []);

  useEffect(() => {
    localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
  }, [agendamentos]);

  const adicionarOuEditarAgendamento = (e) => {
    e.preventDefault();

    if (!titulo || !data || !hora || !clienteId || !profissionalId || !servicoId) {
      alert("Preencha todos os campos!");
      return;
    }

    if (editId) {
      const atualizado = agendamentos.map((a) =>
        a.id === editId
          ? { ...a, titulo, data, hora, clienteId, profissionalId, servicoId, status }
          : a
      );
      setAgendamentos(atualizado);
      setEditId(null);
    } else {
      const novo = {
        id: Date.now(),
        titulo,
        data,
        hora,
        clienteId,
        profissionalId,
        servicoId,
        status,
      };
      setAgendamentos([...agendamentos, novo]);
    }

    setTitulo(""); setData(""); setHora("");
    setClienteId(""); setProfissionalId(""); setServicoId("");
    setStatus("pendente");
  };

  const removerAgendamento = (id) => {
    setAgendamentos(agendamentos.filter((a) => a.id !== id));
  };

  const iniciarEdicao = (agendamento) => {
    setTitulo(agendamento.titulo);
    setData(agendamento.data);
    setHora(agendamento.hora);
    setClienteId(agendamento.clienteId);
    setProfissionalId(agendamento.profissionalId);
    setServicoId(agendamento.servicoId);
    setStatus(agendamento.status);
    setEditId(agendamento.id);
  };

  const cancelarEdicao = () => {
    setTitulo(""); setData(""); setHora("");
    setClienteId(""); setProfissionalId(""); setServicoId("");
    setStatus("pendente");
    setEditId(null);
  };

  // Atualiza status diretamente
  const atualizarStatus = (id, novoStatus) => {
    const atualizado = agendamentos.map((a) =>
      a.id === id ? { ...a, status: novoStatus } : a
    );
    setAgendamentos(atualizado);
  };

  // Estado para o filtro
  const [filtroCampo, setFiltroCampo] = useState("titulo"); // campo padrão 
  const [filtroValor, setFiltroValor] = useState(""); // valor digitado

  // Função para formatar a data manualmente (evita bug de fuso horário) 
  function formatarDataBR(dataStr) { 
    if (!dataStr) return ""; 
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`; }


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Agendamento</h1>

      <form onSubmit={adicionarOuEditarAgendamento} className="space-y-3 mb-6">
        <input type="text" placeholder="Título" className="input input-bordered w-full"
          value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        <input type="date" className="input input-bordered w-full"
          value={data} onChange={(e) => setData(e.target.value)} />
        <input type="time" className="input input-bordered w-full"
          value={hora} onChange={(e) => setHora(e.target.value)} />

        {clientes.length > 0 ? (
          <select value={clienteId} onChange={(e) => setClienteId(Number(e.target.value))}
            className="select select-bordered w-full">
            <option value="">Selecione o Cliente</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        ) : <p className="text-warning">⚠️ Cadastre clientes antes de agendar.</p>}

        {profissionais.length > 0 ? (
          <select value={profissionalId} onChange={(e) => setProfissionalId(Number(e.target.value))}
            className="select select-bordered w-full">
            <option value="">Selecione o Profissional</option>
            {profissionais.map(p => (
              <option key={p.id} value={p.id}>{p.nome} — {p.especialidade}</option>
            ))}
          </select>
        ) : <p className="text-warning">⚠️ Cadastre profissionais antes de agendar.</p>}

        {servicos.length > 0 ? (
          <select value={servicoId} onChange={(e) => setServicoId(Number(e.target.value))}
            className="select select-bordered w-full">
            <option value="">Selecione o Serviço</option>
            {servicos.map(s => (
              <option key={s.id} value={s.id}>{s.nome} — {s.duracao} — R$ {s.preco}</option>
            ))}
          </select>
        ) : <p className="text-warning">⚠️ Cadastre serviços antes de agendar.</p>}

        {/* Novo campo de status */}
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="select select-bordered w-full">
          <option value="pendente">Pendente</option>
          <option value="confirmado">Confirmado</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </select>

        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary flex-1">
            {editId ? "Salvar Edição" : "Adicionar Agendamento"}
          </button>
          {editId && (
            <button type="button" className="btn btn-secondary flex-1" onClick={cancelarEdicao}>
              Voltar
            </button>
          )}
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-3">Agendamentos</h2>
      <div className="flex gap-2 mb-4">
        <select
          value={filtroCampo}
          onChange={(e) => setFiltroCampo(e.target.value)}
          className="select select-bordered"
        >
          <option value="titulo">Título</option>
          <option value="cliente">Cliente</option>
          <option value="profissional">Profissional</option>
          <option value="servico">Serviço</option>
          <option value="data">Data</option>
          <option value="hora">Hora</option>
          <option value="status">Status</option>
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
        {agendamentos
          .filter((a) => {
            const cliente = clientes.find(c => c.id === a.clienteId)?.nome || "";
            const profissional = profissionais.find(p => p.id === a.profissionalId)?.nome || "";
            const servico = servicos.find(s => s.id === a.servicoId)?.nome || "";

            switch (filtroCampo) {
              case "titulo":
                return a.titulo.toLowerCase().includes(filtroValor);
              case "cliente":
                return cliente.toLowerCase().includes(filtroValor);
              case "profissional":
                return profissional.toLowerCase().includes(filtroValor);
              case "servico":
                return servico.toLowerCase().includes(filtroValor);
              case "data":
                return a.data.toLowerCase().includes(filtroValor);
              case "hora":
                return a.hora.toLowerCase().includes(filtroValor);
              case "status":
                return a.status.toLowerCase().includes(filtroValor);
              default:
                return true;
            }
          })
          .map((a) => {
            const cliente = clientes.find(c => c.id === a.clienteId);
            const profissional = profissionais.find(p => p.id === a.profissionalId);
            const servico = servicos.find(s => s.id === a.servicoId);

            return (
              <li key={a.id} className="flex justify-between items-center p-3 bg-base-200 rounded">
                <span>
                  {a.titulo} — {formatarDataBR(a.data)} às {a.hora}
                  <br />
                  Cliente: {cliente ? cliente.nome : "Não definido"} | Profissional: {profissional ? profissional.nome : "Não definido"}
                  <br />
                  Serviço: {servico ? `${servico.nome} — ${servico.duracao} — R$ ${servico.preco}` : "Não definido"}
                  {/* Botões de status coloridos */}
                  <div className="flex gap-2 pt-[15px]">
                    <button
                      className={`btn btn-xs ${a.status === "pendente" ? "btn-warning" : "btn-outline"}`}
                      onClick={() => atualizarStatus(a.id, "pendente")}
                    >
                      Pendente
                    </button>
                    <button
                      className={`btn btn-xs ${a.status === "confirmado" ? "btn-info" : "btn-outline"}`}
                      onClick={() => atualizarStatus(a.id, "confirmado")}
                    >
                      Confirmado
                    </button>
                    <button
                      className={`btn btn-xs ${a.status === "concluido" ? "btn-success" : "btn-outline"}`}
                      onClick={() => atualizarStatus(a.id, "concluido")}
                    >
                      Concluído
                    </button>
                    <button
                      className={`btn btn-xs ${a.status === "cancelado" ? "btn-error" : "btn-outline"}`}
                      onClick={() => atualizarStatus(a.id, "cancelado")}
                    >
                      Cancelado
                    </button>
                  </div>
                </span>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button className="btn btn-warning btn-sm" onClick={() => iniciarEdicao(a)}>Editar</button>
                    {editId !== a.id && (
                      <button className="btn btn-error btn-sm" onClick={() => removerAgendamento(a.id)}>Remover</button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
