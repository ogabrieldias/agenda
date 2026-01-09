import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";

function Navbar() {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate(); // hook para redirecionar

  useEffect(() => {
    // Escuta mudanças de login/logout no Firebase
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
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

      <div className="navbar-end">
        {user && (
          <button
            className="btn btn-ghost"
            onClick={async () => {
              await signOut(auth);   // encerra sessão no Firebase
              navigate("/login");    // redireciona para Login.jsx
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
