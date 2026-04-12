import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importação das Páginas
import Login from './Paginas/Login';
import Administrador from './Paginas/Administrador';
import ExplicadorPagina from './Paginas/ExplicadorPagina';
import AlunoPagina from './Paginas/AlunoPagina';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota Principal - Login */}
        <Route path="/" element={<Login />} />
        
        {/* Rota do Geraldo (Super Admin) */}
        <Route path="/admin" element={<Administrador />} />
        
        {/* Rota dos Explicadores/Professores */}
        <Route path="/professor" element={<ExplicadorPagina />} />
        
        {/* Rota dos Alunos */}
        <Route path="/aluno" element={<AlunoPagina />} />
      </Routes>
    </Router>
  );
}

export default App;