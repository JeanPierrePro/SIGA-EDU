import React, { useState, useEffect } from 'react';
import { PlusCircle, BookOpen, Trash2, Hash } from 'lucide-react';
import axios from 'axios';

interface Materia {
    id: number;
    nome: string;
}

const GestaoMaterias: React.FC = () => {
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [loading, setLoading] = useState(true);

    const carregarMaterias = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5022/api/Admin/materias', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMaterias(response.data);
        } catch (error) {
            console.error("Erro ao carregar matérias:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { carregarMaterias(); }, []);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50/30">
                    <div>
                        <h3 className="text-xl font-black text-gray-800">Disciplinas Disponíveis</h3>
                        <p className="text-sm text-gray-400 font-medium">Catálogo global de matérias do centro</p>
                    </div>
                    <button className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-emerald-100 active:scale-95">
                        <PlusCircle className="w-5 h-5" /> <span>Nova Matéria</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-[10px] uppercase text-gray-400 font-black tracking-widest">
                            <tr>
                                <th className="px-8 py-5 flex items-center gap-2"><Hash className="w-3 h-3"/> ID</th>
                                <th className="px-8 py-5">Nome da Disciplina</th>
                                <th className="px-8 py-5 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {materias.map(materia => (
                                <tr key={materia.id} className="hover:bg-emerald-50/20 transition group">
                                    <td className="px-8 py-5 text-gray-400 font-mono text-xs">#{materia.id}</td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-sm">
                                                <BookOpen className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-gray-700 text-base">{materia.nome}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="text-gray-300 hover:text-red-500 p-2 rounded-lg transition">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!loading && materias.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="p-20 text-center">
                                        <div className="flex flex-col items-center opacity-30">
                                            <BookOpen className="w-16 h-16 mb-4" />
                                            <p className="font-bold">Nenhuma matéria registada no sistema.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-600 p-6 rounded-[24px] text-white shadow-xl shadow-emerald-100">
                    <p className="text-emerald-100 text-xs font-black uppercase tracking-widest">Total de Disciplinas</p>
                    <h4 className="text-4xl font-black mt-2">{materias.length}</h4>
                </div>
            </div>
        </div>
    );
};

export default GestaoMaterias;