import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ExplicadorPagina from "./Paginas/ExplicadorPagina";

export default function App() {
  return (
    <BrowserRouter>

      {/* NAVBAR */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between">
        <h1 className="font-bold text-lg">SIGA EDU</h1>

        <div className="flex gap-6">
          <Link to="/" className="hover:underline">
            Home
          </Link>

          <Link to="/explicador" className="hover:underline">
            Explicador
          </Link>
        </div>
      </nav>

      {/* PAGES */}
      <div className="p-6">
        <Routes>
          <Route
            path="/"
            element={
              <h1 className="text-2xl font-bold">
                Bem-vindo ao SIGA EDU
              </h1>
            }
          />

          <Route
            path="/explicador"
            element={<ExplicadorPagina />}
          />
        </Routes>
      </div>

    </BrowserRouter>
  );
}