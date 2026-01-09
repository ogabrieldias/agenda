import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";

function Navbar() {
  const [user, setUser] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState("light"); // tema padrão
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  // Função para trocar tema
  const changeTheme = (theme) => {
    setSelectedTheme(theme);
    document.querySelector("html").setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme); // salva no navegador
  };

  // Carregar tema salvo no localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setSelectedTheme(savedTheme);
      document.querySelector("html").setAttribute("data-theme", savedTheme);
    }
  }, []);

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {user ? (
              <>
                <li><Link to="/calendar">Calendário</Link></li>
                <li><Link to="/agendamento">Agendamento</Link></li>
                <li><Link to="/clientes">Clientes</Link></li>
                <li><Link to="/profissionais">Profissionais</Link></li>
                <li><Link to="/servicos">Serviços</Link></li>
                <li><Link to="/dashboard">Relatório</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/login">Login</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="navbar-center">
        <Link to="/" className="btn btn-ghost text-xl">
          Agenda App
        </Link>
      </div>

      <div className="navbar-end flex items-center gap-2">
        {/* Dropdown de temas */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost">
            Tema: <span className="font-bold">{selectedTheme}</span>
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content bg-base-100 rounded-box w-40 p-2 shadow"
          >
            <li><button onClick={() => changeTheme("light")}>🌞 Light</button></li>
            <li><button onClick={() => changeTheme("luxury")}>💎 Luxury</button></li>
            <li><button onClick={() => changeTheme("synthwave")}>🎶 Synthwave</button></li>
            <li><button onClick={() => changeTheme("forest")}>🌲 Forest</button></li>
          </ul>
        </div>

        {user && (
          <button
            className="btn btn-ghost"
            onClick={async () => {
              await signOut(auth);
              navigate("/login");
            }}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
