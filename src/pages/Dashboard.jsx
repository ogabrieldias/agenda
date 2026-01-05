import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

export default function RelatoriosDashboard() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [servicos, setServicos] = useState([]);

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

  // Filtra agendamentos do mês atual
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  const atendimentosMes = agendamentos.filter((a) => {
    const dataAgendamento = new Date(`${a.data}T${a.hora}`);
    return (
      dataAgendamento.getMonth() === mesAtual &&
      dataAgendamento.getFullYear() === anoAtual
    );
  });

  // Receita total
  const receitaTotal = atendimentosMes.reduce((total, a) => {
    const servico = servicos.find((s) => s.id === a.servicoId);
    return total + (servico ? Number(servico.preco) : 0);
  }, 0);

  // Contagem de serviços
  const servicoContagem = {};
  atendimentosMes.forEach((a) => {
    if (a.servicoId) {
      servicoContagem[a.servicoId] = (servicoContagem[a.servicoId] || 0) + 1;
    }
  });

  const servicoLabels = Object.keys(servicoContagem).map(
    (id) => servicos.find((s) => s.id === Number(id))?.nome || "Desconhecido"
  );
  const servicoData = Object.values(servicoContagem);

  // Contagem de profissionais
  const profissionalContagem = {};
  atendimentosMes.forEach((a) => {
    if (a.profissionalId) {
      profissionalContagem[a.profissionalId] =
        (profissionalContagem[a.profissionalId] || 0) + 1;
    }
  });

  const profissionalLabels = Object.keys(profissionalContagem).map(
    (id) => profissionais.find((p) => p.id === Number(id))?.nome || "Desconhecido"
  );
  const profissionalData = Object.values(profissionalContagem);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard de Relatórios</h1>

      {/* Cards Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-base-200 rounded shadow">
          <h2 className="text-lg font-semibold">Atendimentos no mês</h2>
          <p className="text-2xl font-bold">{atendimentosMes.length}</p>
        </div>
        <div className="p-4 bg-base-200 rounded shadow">
          <h2 className="text-lg font-semibold">Receita estimada</h2>
          <p className="text-2xl font-bold">R$ {receitaTotal.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-base-200 rounded shadow">
          <h2 className="text-lg font-semibold">Serviços cadastrados</h2>
          <p className="text-2xl font-bold">{servicos.length}</p>
        </div>
        <div className="p-4 bg-base-200 rounded shadow">
          <h2 className="text-lg font-semibold">Profissionais ativos</h2>
          <p className="text-2xl font-bold">{profissionais.length}</p>
        </div>
      </div>

      {/* Gráfico de Serviços */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Serviços mais agendados</h2>
        <Bar
          data={{
            labels: servicoLabels,
            datasets: [
              {
                label: "Quantidade de Agendamentos",
                data: servicoData,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
              },
            ],
          }}
          options={{ responsive: true, plugins: { legend: { display: false } } }}
        />
      </div>

      {/* Gráfico de Profissionais */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Profissionais com mais atendimentos</h2>
        <Pie
          data={{
            labels: profissionalLabels,
            datasets: [
              {
                label: "Atendimentos",
                data: profissionalData,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                ],
              },
            ],
          }}
          options={{ responsive: true }}
        />
      </div>
    </div>
  );
}
