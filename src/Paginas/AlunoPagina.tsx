import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, UserCircle, LogOut, GraduationCap } from 'lucide-react'; 

import CalendarioSessoes from '../Entidades/aluno/componentes/CalendarioSessoes';
import PerfilAluno from '../Entidades/aluno/componentes/PerfilAluno';

const AlunoPagina: React.FC = () => {
    const navigate = useNavigate();
    const userEmail = localStorage.getItem('userEmail') || 'aluno@sigaedu.com';
    
    const [abaAtiva, setAbaAtiva] = useState<'calendario' | 'perfil'>('calendario');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-900 flex">
            
            {/* SIDEBAR */}
            <div className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 text-white flex flex-col shadow-2xl">
                
                {/* Cabeçalho da Sidebar */}
                <div className="p-6 border-b border-white/10 flex items-center space-x-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-400/30">
                        <GraduationCap className="w-6 h-6 text-blue-300" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight">SIGA <span className="text-blue-300">EDU</span></h1>
                        <p className="text-[9px] text-blue-200/70 uppercase tracking-widest font-bold mt-0.5">Portal do Aluno</p>
                    </div>
                </div>
                
                {/* Menu Principal (Agora só tem a Agenda) */}
                <nav className="flex-1 p-4 mt-4">
                    <button onClick={() => setAbaAtiva('calendario')}
                        className={`w-full flex items-center space-x-3 py-3 px-4 rounded-xl transition-all ${abaAtiva === 'calendario' ? 'bg-blue-500/40 shadow-inner border border-white/20 text-white' : 'hover:bg-white/10 border border-transparent text-blue-200 hover:text-white'}`}>
                        <CalendarDays className="w-5 h-5 opacity-90" /> 
                        <span className="font-bold text-sm tracking-wide">A Minha Agenda</span>
                    </button>
                </nav>

                {/* ZONA DE PERFIL INTERATIVA E LOGOUT */}
                <div className="p-4 border-t border-white/10 bg-black/10 flex flex-col gap-2">
                    
                    {/* Botão do Perfil do Utilizador */}
                    <button 
                        onClick={() => setAbaAtiva('perfil')}
                        className={`flex items-center text-left space-x-3 p-3 rounded-xl transition-all w-full border ${abaAtiva === 'perfil' ? 'bg-white/10 border-white/20 shadow-inner' : 'border-transparent hover:bg-white/5'}`}
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-400 border border-white/20 flex items-center justify-center text-white font-black shadow-lg shadow-blue-900/50 shrink-0">
                            {userEmail.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">Estudante</p>
                            <p className="text-[10px] text-blue-200/70 truncate">{userEmail}</p>
                        </div>
                    </button>
                    
                    {/* Botão de Sair */}
                    <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 bg-white/5 hover:bg-red-500/90 py-2.5 rounded-xl font-bold transition-all border border-white/10 hover:border-red-400/50 text-blue-100 hover:text-white group mt-1">
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm">Terminar Sessão</span>
                    </button>
                </div>
            </div>

            {/* ÁREA PRINCIPAL */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-white/5 backdrop-blur-md border-b border-white/10 h-20 flex justify-between items-center px-10 shrink-0">
                    <h2 className="text-xl font-bold text-white tracking-wide capitalize flex items-center space-x-2">
                        {abaAtiva === 'calendario' ? (
                            <><CalendarDays className="w-6 h-6 text-blue-300" /> <span>Marcar Explicações</span></>
                        ) : (
                            <><UserCircle className="w-6 h-6 text-blue-300" /> <span>Configurações de Conta</span></>
                        )}
                    </h2>
                </header>

                <main className="flex-1 p-8 overflow-y-auto">
                    {abaAtiva === 'calendario' ? <CalendarioSessoes /> : <PerfilAluno />}
                </main>
            </div>
        </div>
    );
};

export default AlunoPagina;