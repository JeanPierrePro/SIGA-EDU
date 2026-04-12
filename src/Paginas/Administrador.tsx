import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, GraduationCap, BookOpen, LogOut, ShieldAlert } from 'lucide-react';

// 📦 IMPORTAÇÃO DOS COMPONENTES
import DashboardResumo from '../Entidades/Administrador/componentes/DashboardResumo';
import GestaoAlunos from '../Entidades/Administrador/componentes/GestaoAlunos';
import GestaoExplicadores from '../Entidades/Administrador/componentes/GestaoExplicadores';
import GestaoMaterias from '../Entidades/Administrador/componentes/GestaoMaterias';
import PerfilAdmin from '../Entidades/Administrador/componentes/PerfilAdmin'; // <-- Adicionado o Perfil!

const Administrador: React.FC = () => {
    const navigate = useNavigate();
    const userEmail = localStorage.getItem('userEmail') || 'admin@sigaedu.com';
    
    // Adicionada a opção 'perfil' aqui 👇
    const [abaAtiva, setAbaAtiva] = useState<'dashboard' | 'alunos' | 'explicadores' | 'materias' | 'perfil'>('dashboard');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    // 🧩 RENDERIZAÇÃO CONDICIONAL
    const renderConteudo = () => {
        switch (abaAtiva) {
            case 'dashboard': return <DashboardResumo />;
            case 'alunos': return <GestaoAlunos />;
            case 'explicadores': return <GestaoExplicadores />;
            case 'materias': return <GestaoMaterias />;
            case 'perfil': return <PerfilAdmin />; // <-- Injetado aqui!
            default: return <DashboardResumo />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            
            {/* BARRA LATERAL (SIDEBAR) */}
            <div className="w-72 bg-indigo-950 text-white flex flex-col shadow-2xl z-10">
                <div className="p-8 border-b border-indigo-900/50 flex items-center space-x-3">
                    <div className="bg-indigo-900 p-2 rounded-lg">
                        <ShieldAlert className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter">SIGA <span className="text-blue-400">EDU</span></h1>
                        <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold mt-1">Admin Panel</p>
                    </div>
                </div>
                
                <nav className="flex-1 p-6 space-y-2">
                    <button onClick={() => setAbaAtiva('dashboard')}
                        className={`w-full flex items-center space-x-3 py-3.5 px-4 rounded-xl transition-all ${abaAtiva === 'dashboard' ? 'bg-blue-600 shadow-lg shadow-blue-900/50 translate-x-2 text-white' : 'hover:bg-indigo-900 text-indigo-300 hover:text-white'}`}>
                        <LayoutDashboard className="w-5 h-5" /> <span className="font-bold text-sm">Dashboard</span>
                    </button>
                    
                    <button onClick={() => setAbaAtiva('alunos')}
                        className={`w-full flex items-center space-x-3 py-3.5 px-4 rounded-xl transition-all ${abaAtiva === 'alunos' ? 'bg-blue-600 shadow-lg shadow-blue-900/50 translate-x-2 text-white' : 'hover:bg-indigo-900 text-indigo-300 hover:text-white'}`}>
                        <Users className="w-5 h-5" /> <span className="font-bold text-sm">Gerir Alunos</span>
                    </button>

                    <button onClick={() => setAbaAtiva('explicadores')}
                        className={`w-full flex items-center space-x-3 py-3.5 px-4 rounded-xl transition-all ${abaAtiva === 'explicadores' ? 'bg-blue-600 shadow-lg shadow-blue-900/50 translate-x-2 text-white' : 'hover:bg-indigo-900 text-indigo-300 hover:text-white'}`}>
                        <GraduationCap className="w-5 h-5" /> <span className="font-bold text-sm">Explicadores</span>
                    </button>

                    <button onClick={() => setAbaAtiva('materias')}
                        className={`w-full flex items-center space-x-3 py-3.5 px-4 rounded-xl transition-all ${abaAtiva === 'materias' ? 'bg-blue-600 shadow-lg shadow-blue-900/50 translate-x-2 text-white' : 'hover:bg-indigo-900 text-indigo-300 hover:text-white'}`}>
                        <BookOpen className="w-5 h-5" /> <span className="font-bold text-sm">Matérias</span>
                    </button>
                </nav>

                <div className="p-6 border-t border-indigo-900/50 flex flex-col gap-2">
                    {/* 👇 O BOTAO DE PERFIL AGORA ATIVA A ABA 'perfil' */}
                    <button 
                        onClick={() => setAbaAtiva('perfil')}
                        className={`w-full flex items-center space-x-3 p-3 rounded-xl border transition-all ${abaAtiva === 'perfil' ? 'bg-white/10 border-white/20 shadow-inner' : 'border-transparent hover:bg-white/5'}`}
                    >
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center font-black text-white shadow-lg shrink-0">
                            {userEmail.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <p className="text-sm font-bold text-white truncate">Geraldo Admin</p>
                            <p className="text-[10px] text-indigo-300 truncate">{userEmail}</p>
                        </div>
                    </button>

                    <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 bg-indigo-900/40 hover:bg-red-500 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors group text-indigo-200 hover:text-white mt-1">
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Sair do Sistema</span>
                    </button>
                </div>
            </div>

            {/* ÁREA DE CONTEÚDO */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-white border-b border-gray-200 h-20 flex justify-between items-center px-10 shrink-0">
                    <h2 className="text-gray-400 font-medium flex items-center space-x-2">
                        <span>Início</span> <span className="mx-2">/</span> <span className="text-gray-800 font-bold capitalize">{abaAtiva}</span>
                    </h2>
                    
                    {/* Indicador de Online */}
                    <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Sistema Online</span>
                    </div>
                </header>

                <main className="flex-1 p-10 overflow-y-auto bg-gray-50/50">
                    <div className="max-w-7xl mx-auto">
                        {/* INJEÇÃO DAS PEÇAS AQUI */}
                        {renderConteudo()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Administrador;