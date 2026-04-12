import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Paginas/Login';
import Administrador from './Paginas/Administrador';

// Se a Vishwa tiver criado ficheiros novos, podes importar aqui depois
// import Professor from './Paginas/Professor';
// import Aluno from './Paginas/Aluno';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Administrador />} />
        {/* Adiciona as rotas da Vishwa aqui em baixo se precisares */}
        {/* <Route path="/professor" element={<Professor />} /> */}
      </Routes>
    </Router>
  );
}

export default App;