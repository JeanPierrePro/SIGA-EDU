<<<<<<< HEAD
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
=======
import './index.css'; 
import PerfilAluno from './Entidades/aluno/PerfilAluno';

function App() {
  const meuPerfil = {
    id: 1,
    nome: "Teu Nome de Aluno",
    email: "aluno@escola.pt",
    turma: "12º Ano - Informática"
  };

  return (
    /* ESTRUTURA PRINCIPAL:
       - min-h-screen: Garante que o fundo cubra a altura toda da janela.
       - w-full: Garante que a largura ocupe 100% do ecrã.
       - bg-[#0f172a]: Cor azul-noite profunda para eliminar o branco.
       - overflow-x-hidden: Evita que apareça barra de rolagem lateral desnecessária.
    */
    <div className="min-h-screen w-full bg-[#0f172a] font-sans text-slate-100 flex flex-col overflow-x-hidden">
      
      {/* NAVBAR: 
          Agora sem limites laterais apertados para a borda cruzar o ecrã todo.
      */}
      <nav className="w-full bg-slate-900/90 border-b border-slate-800 p-4 backdrop-blur-md sticky top-0 z-50">
        <div className="w-full max-w-[1600px] mx-auto flex justify-between items-center px-6">
          <h1 className="text-xl font-black text-blue-400 tracking-tighter italic uppercase">
            SIGA-EDU <span className="text-slate-500 font-light lowercase">| Portal do Aluno</span>
          </h1>
          
          <div className="flex items-center gap-4 bg-slate-800/40 px-5 py-2 rounded-full border border-slate-700/50 shadow-2xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">
              {meuPerfil.turma}
            </span>
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/20"></div>
          </div>
        </div>
      </nav>

      {/* CONTEÚDO PRINCIPAL: 
          - flex-1: Empurra o footer para baixo.
          - max-w-[1600px]: Aumentado para 1600px para o calendário respirar em monitores grandes.
      */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 py-10">
        <div className="w-full h-full animate-in fade-in duration-700">
          <PerfilAluno aluno={meuPerfil} />
        </div>
      </main>

      {/* FOOTER:
          Garante que o fundo do site termine com um toque profissional.
      */}
      <footer className="w-full p-8 border-t border-slate-800/50 bg-slate-950/20 text-center">
        <p className="text-slate-600 text-[10px] uppercase tracking-[0.3em] font-medium">
          © 2026 SIGA-EDU • Sistema Integrado de Gestão de Aprendizagem
        </p>
      </footer>
    </div>
>>>>>>> 1bf33569935a99438fbe0df5d43263c55f5fb02d
  );
}

export default App;