import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Paginas/Login';
import Administrador from './Paginas/Administrador';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Administrador />} />
      </Routes>
    </Router>
  );
}

export default App;