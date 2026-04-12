import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, UserCircle, LogOut, GraduationCap, Clock } from 'lucide-react'; 

// IMPORTANTE: Caminhos corrigidos para a pasta Compartilhado
import CalendarioExplicador from '../Compartilhado/componentes/CalendarioExplicador';
import PerfilExplicador from '../Compartilhado/componentes/PerfilExplicador';

const ExplicadorPagina: React.FC = () => {
    const navigate = useNavigate();
    const userEmail = localStorage.getItem('userEmail') || 'professor@sigaedu.com';
    const [abaAtiva, setAbaAtiva] = useState<'agenda' | 'perfil'>('agenda');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-700 to-slate-900 flex">
            
            {/* SIDEBAR - DESIGN PREMIUM */}
            <div className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 text-white flex flex-col shadow-2xl shrink-0">
                <div className="p-6 border-b border-white/10 flex items-center space-x-3">
                    <div className="bg-indigo-500/20 p-2 rounded-lg border border-indigo-400/30">
                        <GraduationCap className="w-6 h-6 text-indigo-300" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight">SIGA <span className="text-indigo-300">PRO</span></h1>
                        <p className="text-[9px] text-indigo-200/70 uppercase tracking-widest font-bold mt-0.5">Portal do Explicador</p>
                    </div>
                </div>
                
                <nav className="flex-1 p-4 mt-4 space-y-2">
                    <button onClick={() => setAbaAtiva('agenda')}
                        className={`w-full flex items-center space-x-3 py-3 px-4 rounded-xl transition-all ${abaAtiva === 'agenda' ? 'bg-indigo-500/40 shadow-inner border border-white/20 text-white' : 'hover:bg-white/10 border border-transparent text-indigo-200 hover:text-white'}`}>
                        <CalendarDays className="w-5 h-5 opacity-90" /> 
                        <span className="font-bold text-sm tracking-wide">Minha Agenda</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-white/10 bg-black/10 flex flex-col gap-2">
                    <button onClick={() => setAbaAtiva('perfil')}
                        className={`flex items-center text-left space-x-3 p-3 rounded-xl transition-all w-full border ${abaAtiva === 'perfil' ? 'bg-white/10 border-white/20 shadow-inner' : 'border-transparent hover:bg-white/5'}`}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-400 to-blue-400 border border-white/20 flex items-center justify-center text-white font-black shadow-lg shrink-0">
                            {userEmail.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">Explicador</p>
                            <p className="text-[10px] text-indigo-200/70 truncate">{userEmail}</p>
                        </div>
                    </button>
                    
                    <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 bg-white/5 hover:bg-red-500/90 py-2.5 rounded-xl font-bold transition-all border border-white/10 text-indigo-100 hover:text-white group mt-1">
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm">Terminar Sessão</span>
                    </button>
                </div>
            </div>

            {/* ÁREA PRINCIPAL */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-white/5 backdrop-blur-md border-b border-white/10 h-20 flex justify-between items-center px-10 shrink-0">
                    <h2 className="text-xl font-bold text-white tracking-wide flex items-center space-x-2">
                        {abaAtiva === 'agenda' ? (
                            <><Clock className="w-6 h-6 text-indigo-300" /> <span>Gestão de Horários</span></>
                        ) : (
                            <><UserCircle className="w-6 h-6 text-indigo-300" /> <span>Perfil Profissional</span></>
                        )}
                    </h2>
                </header>

                <main className="flex-1 p-8 overflow-y-auto">
                    {abaAtiva === 'agenda' ? <CalendarioExplicador /> : <PerfilExplicador />}
                </main>
            </div>
        </div>
    );
};

export default ExplicadorPagina;