import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Firebase
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, collection, getDocs } from "firebase/firestore";

const locales = { "pt-BR": ptBR };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [nomeUsuario, setNomeUsuario] = useState("");

  // filtros
  const [filtroProfissional, setFiltroProfissional] = useState("");
  const [filtroServico, setFiltroServico] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  // estados para dados do Firestore
  const [agendamentos, setAgendamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [servicos, setServicos] = useState([]);

  // 🔎 Recupera usuário logado e carrega dados das subcoleções
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setNomeUsuario(user.displayName || user.email);

        const userDoc = doc(db, "usuarios", user.uid);

        // clientes
        const clientesSnap = await getDocs(collection(userDoc, "clientes"));
        setClientes(clientesSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // profissionais
        const profSnap = await getDocs(collection(userDoc, "profissionais"));
        setProfissionais(profSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // servicos
        const servSnap = await getDocs(collection(userDoc, "servicos"));
        setServicos(servSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // agendamentos
        const agendSnap = await getDocs(collection(userDoc, "agendamentos"));
        setAgendamentos(agendSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        setNomeUsuario("");
        setClientes([]);
        setProfissionais([]);
        setServicos([]);
        setAgendamentos([]);
      }
    });
    return () => unsub();
  }, []);

  // Converte agendamentos em eventos
  const events = agendamentos.map((a) => {
    const start = new Date(`${a.data}T${a.hora}`);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const cliente = clientes.find((c) => c.id === a.clienteId);
    const profissional = profissionais.find((p) => p.id === a.profissionalId);
    const servico = servicos.find((s) => s.id === a.servicoId);

    return {
      title: `${a.titulo} — ${cliente ? cliente.nome : "Cliente"} atendido por ${
        profissional ? profissional.nome : "Profissional"
      } — Serviço: ${servico ? servico.nome : "Não definido"} às ${a.hora}`,
      start,
      end,
      status: a.status,
      profissionalId: a.profissionalId,
      servicoId: a.servicoId,
      cliente: cliente ? cliente.nome : "",
      profissional: profissional ? profissional.nome : "",
      servico: servico ? servico.nome : "",
    };
  });

  // aplica filtros
  const eventsFiltrados = events.filter(
    (e) =>
      (!filtroProfissional || e.profissionalId === filtroProfissional) &&
      (!filtroServico || e.servicoId === filtroServico) &&
      (!filtroStatus || e.status === filtroStatus)
  );

  return (
    <div className="p-6">
      {/* Mensagem de boas-vindas */}
      {nomeUsuario && (
        <h2 className="text-xl mb-2">Bem-vindo, {nomeUsuario}</h2>
      )}

      <h1 className="text-2xl font-bold mb-4">Calendário de Agendamentos</h1>

      {/* Filtros */}
      <div className="flex gap-4 mb-4">
        <select
          value={filtroProfissional}
          onChange={(e) => setFiltroProfissional(e.target.value)}
          className="select select-bordered"
        >
          <option value="">Todos os profissionais</option>
          {profissionais.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>

        <select
          value={filtroServico}
          onChange={(e) => setFiltroServico(e.target.value)}
          className="select select-bordered"
        >
          <option value="">Todos os serviços</option>
          {servicos.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nome}
            </option>
          ))}
        </select>

        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="select select-bordered"
        >
          <option value="">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="confirmado">Confirmado</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {/* Calendário */}
      <Calendar
        localizer={localizer}
        events={eventsFiltrados}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={["month", "week", "day"]}
        toolbar={true}
        date={date}
        view={view}
        onNavigate={(newDate) => setDate(newDate)}
        onView={(newView) => setView(newView)}
        eventPropGetter={(event) => {
          let backgroundColor = "#6b7280"; // cinza padrão
          if (event.status === "pendente") backgroundColor = "#facc15"; // amarelo
          if (event.status === "confirmado") backgroundColor = "#3b82f6"; // azul
          if (event.status === "concluido") backgroundColor = "#22c55e"; // verde
          if (event.status === "cancelado") backgroundColor = "#ef4444"; // vermelho
          return { style: { backgroundColor, color: "white" } };
        }}
      />
    </div>
  );
}