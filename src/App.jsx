import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Agendamento from "./pages/Agendamento.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import Clientes from "./pages/Clientes.jsx";
import Profissionais from "./pages/Profissionais.jsx";
import Servicos from "./pages/Servicos.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/profissionais" element={<Profissionais />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;
