import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Administrador: React.FC = () => {
    const navigate = useNavigate();
    const userEmail = localStorage.getItem('userEmail');
    
    const [abaAtiva, setAbaAtiva] = useState<'dashboard' | 'alunos' | 'explicadores' | 'materias'>('dashboard');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const renderConteudo = () => {
        switch (abaAtiva) {
            case 'dashboard':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg text-xl">👤</div>
                                <div><p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Alunos</p><h3 className="text-2xl font-bold">24</h3></div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg text-xl">👨‍🏫</div>
                                <div><p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Explicadores</p><h3 className="text-2xl font-bold">6</h3></div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                                <div className="p-3 bg-green-100 text-green-600 rounded-lg text-xl">📚</div>
                                <div><p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Matérias</p><h3 className="text-2xl font-bold">12</h3></div>
                            </div>
                        </div>
                        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                            <div className="text-gray-300 mb-2">📊</div>
                            <h3 className="text-gray-400 font-medium">Resumo de atividades do mês aparecerá aqui</h3>
                        </div>
                    </div>
                );

            case 'alunos':
                return (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-700">Gestão de Alunos</h3>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition shadow-md shadow-blue-200">
                                + Registar Aluno
                            </button>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-400 font-bold">
                                <tr>
                                    <th className="px-6 py-4">Nome do Aluno</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr className="hover:bg-blue-50/30 transition">
                                    <td className="px-6 py-4 font-medium text-gray-700">João Silva</td>
                                    <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Ativo</span></td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 hover:underline mr-4 text-sm font-medium">Editar</button>
                                        <button className="text-red-500 hover:underline text-sm font-medium">Apagar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                );

            case 'explicadores':
                return (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-700">Gestão de Explicadores</h3>
                            <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition shadow-md shadow-purple-200">
                                + Novo Explicador
                            </button>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-400 font-bold">
                                <tr>
                                    <th className="px-6 py-4">Nome</th>
                                    <th className="px-6 py-4">Especialidade</th>
                                    <th className="px-6 py-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr className="hover:bg-purple-50/30 transition">
                                    <td className="px-6 py-4 font-medium text-gray-700">Carlos Oliveira</td>
                                    <td className="px-6 py-4 text-gray-600">Matemática / Física</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-purple-600 hover:underline mr-4 text-sm font-medium">Perfil</button>
                                        <button className="text-red-500 hover:underline text-sm font-medium">Remover</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                );

            case 'materias':
                return (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-700">Disciplinas e Matérias</h3>
                            <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition">
                                + Nova Matéria
                            </button>
                        </div>
                        <div className="p-8 text-center text-gray-400">
                            Configure aqui as disciplinas disponíveis no centro de explicações.
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className="w-72 bg-indigo-950 text-white flex flex-col shadow-2xl">
                <div className="p-8 border-b border-indigo-900">
                    <h1 className="text-2xl font-black tracking-tighter">SIGA <span className="text-blue-400">EDU</span></h1>
                    <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold mt-1">Admin Dashboard</p>
                </div>
                
                <nav className="flex-1 p-6 space-y-3">
                    <button onClick={() => setAbaAtiva('dashboard')}
                        className={`w-full flex items-center space-x-3 py-3 px-4 rounded-xl transition-all ${abaAtiva === 'dashboard' ? 'bg-blue-600 shadow-lg shadow-blue-900/50 translate-x-2' : 'hover:bg-indigo-900 text-indigo-300'}`}>
                        <span>🏠</span> <span className="font-bold text-sm">Dashboard</span>
                    </button>
                    
                    <button onClick={() => setAbaAtiva('alunos')}
                        className={`w-full flex items-center space-x-3 py-3 px-4 rounded-xl transition-all ${abaAtiva === 'alunos' ? 'bg-blue-600 shadow-lg shadow-blue-900/50 translate-x-2' : 'hover:bg-indigo-900 text-indigo-300'}`}>
                        <span>👥</span> <span className="font-bold text-sm">Gerir Alunos</span>
                    </button>

                    <button onClick={() => setAbaAtiva('explicadores')}
                        className={`w-full flex items-center space-x-3 py-3 px-4 rounded-xl transition-all ${abaAtiva === 'explicadores' ? 'bg-blue-600 shadow-lg shadow-blue-900/50 translate-x-2' : 'hover:bg-indigo-900 text-indigo-300'}`}>
                        <span>👨‍🏫</span> <span className="font-bold text-sm">Explicadores</span>
                    </button>

                    <button onClick={() => setAbaAtiva('materias')}
                        className={`w-full flex items-center space-x-3 py-3 px-4 rounded-xl transition-all ${abaAtiva === 'materias' ? 'bg-blue-600 shadow-lg shadow-blue-900/50 translate-x-2' : 'hover:bg-indigo-900 text-indigo-300'}`}>
                        <span>📖</span> <span className="font-bold text-sm">Matérias</span>
                    </button>
                </nav>

                <div className="p-6 border-t border-indigo-900">
                    <div className="bg-indigo-900/50 p-4 rounded-2xl mb-4">
                        <p className="text-[10px] text-indigo-400 font-bold uppercase mb-1">Sessão Ativa</p>
                        <p className="text-xs truncate font-medium">{userEmail}</p>
                    </div>
                    <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors">
                        Sair do Sistema
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white border-b border-gray-200 h-20 flex justify-between items-center px-10">
                    <h2 className="text-gray-400 font-medium">Início / <span className="text-gray-800 font-bold capitalize">{abaAtiva}</span></h2>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-800">Geraldo Admin</p>
                            <p className="text-[10px] text-green-500 font-bold uppercase">Online</p>
                        </div>
                        <div className="h-12 w-12 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-blue-200">
                            G
                        </div>
                    </div>
                </header>

                <main className="p-10 max-w-7xl">
                    {renderConteudo()}
                </main>
            </div>
        </div>
    );
};

export default Administrador;