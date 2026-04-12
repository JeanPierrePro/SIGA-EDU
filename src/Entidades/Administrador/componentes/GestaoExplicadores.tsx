import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, X, Plus, BookOpen } from 'lucide-react';
import axios from 'axios';

const GestaoExplicadores: React.FC = () => {
    const [explicadores, setExplicadores] = useState<any[]>([]);
    const [materiasExistentes, setMateriasExistentes] = useState<any[]>([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [loading, setLoading] = useState(false);
    const [materiasSelecionadas, setMateriasSelecionadas] = useState<string[]>([]);
    const [novaMateriaInput, setNovaMateriaInput] = useState('');
    const [formData, setFormData] = useState({ nome: '', email: '', password: '' });

    const carregarDados = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const resExp = await axios.get('http://localhost:5022/api/Admin/explicadores', { headers });
            const resMat = await axios.get('http://localhost:5022/api/Admin/materias', { headers });
            
            console.log("Dados dos Explicadores:", resExp.data); // Vê o que aparece no F12 do navegador!
            setExplicadores(resExp.data);
            setMateriasExistentes(resMat.data);
        } catch (err) { console.error("Erro ao carregar dados", err); }
    };

    useEffect(() => { carregarDados(); }, []);

    const toggleMateria = (nome: string) => {
        setMateriasSelecionadas(prev => 
            prev.includes(nome) ? prev.filter(m => m !== nome) : [...prev, nome]
        );
    };

    const adicionarMateriaManual = () => {
        if (novaMateriaInput.trim() && !materiasSelecionadas.includes(novaMateriaInput)) {
            setMateriasSelecionadas([...materiasSelecionadas, novaMateriaInput.trim()]);
            setNovaMateriaInput('');
        }
    };

    const handleCriar = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5022/api/Admin/criar-membro', {
                ...formData,
                role: 'Explicador',
                especialidade: materiasSelecionadas.join(', ')
            }, { headers: { Authorization: `Bearer ${token}` } });

            setModalAberto(false);
            setMateriasSelecionadas([]);
            setFormData({ nome: '', email: '', password: '' });
            await carregarDados(); // Recarrega a lista
        } catch (err) { alert("Erro ao registar."); }
        finally { setLoading(false); }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/30">
                <h3 className="text-xl font-black text-gray-800">Equipa de Explicadores</h3>
                <button onClick={() => setModalAberto(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition shadow-lg active:scale-95">
                    <UserPlus className="w-5 h-5" /> <span>Novo Explicador</span>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-[10px] uppercase text-gray-400 font-black tracking-widest">
                        <tr><th className="px-8 py-5">Nome</th><th className="px-8 py-5">Matérias</th><th className="px-8 py-5 text-right">Ações</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {explicadores.map(exp => (
                            <tr key={exp.id || exp.Id} className="hover:bg-indigo-50/30 transition">
                                <td className="px-8 py-5 font-bold text-gray-700">
                                    {exp.nome || exp.Nome}
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex flex-wrap gap-2">
                                        {(exp.especialidade || exp.Especialidade || "").split(',').map((s: string, i: number) => (
                                            <span key={i} className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-full border border-indigo-100 uppercase">
                                                {s.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-right"><button className="text-gray-300 hover:text-red-500 transition"><Trash2 className="w-5 h-5" /></button></td>
                            </tr>
                        ))}
                        {explicadores.length === 0 && (
                            <tr><td colSpan={3} className="px-8 py-10 text-center text-gray-400 italic">Nenhum explicador na lista.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {modalAberto && (
                <div className="fixed inset-0 bg-indigo-950/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-8 border-b flex justify-between items-center">
                            <h3 className="text-2xl font-black text-indigo-950">Novo Explicador</h3>
                            <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-red-500 transition"><X /></button>
                        </div>

                        <form onSubmit={handleCriar} className="p-8 space-y-5">
                            <input required placeholder="Nome Completo" className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
                            <input required type="email" placeholder="E-mail" className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <BookOpen className="w-3 h-3" /> Matérias (Clica para selecionar)
                                </label>
                                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 min-h-[80px]">
                                    {materiasExistentes.map(m => (
                                        <button key={m.id || m.Id} type="button" onClick={() => toggleMateria(m.nome || m.Nome)} 
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${materiasSelecionadas.includes(m.nome || m.Nome) ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-200'}`}>
                                            {m.nome || m.Nome}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex space-x-2">
                                    <input placeholder="Adicionar nova matéria..." className="flex-1 px-5 py-3 bg-white border-2 border-gray-100 rounded-xl text-xs outline-none focus:border-indigo-500" value={novaMateriaInput} onChange={e => setNovaMateriaInput(e.target.value)} />
                                    <button type="button" onClick={adicionarMateriaManual} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition"><Plus /></button>
                                </div>
                            </div>

                            <input required type="password" placeholder="Senha Provisória" className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />

                            <button disabled={loading || materiasSelecionadas.length === 0} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-[24px] shadow-xl transition-all active:scale-[0.98] disabled:opacity-50">
                                {loading ? 'A Gravar...' : 'Registar Professor'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestaoExplicadores;