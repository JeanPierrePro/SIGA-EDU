import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Check, Save } from 'lucide-react';
import axios from 'axios';

const CalendarioExplicador: React.FC = () => {
    const [dataReferencia, setDataReferencia] = useState(new Date());
    const [selecionados, setSelecionados] = useState<string[]>([]);
    const [salvos, setSalvos] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const horas = ["09:00","10:00","11:00","12:00","14:00","15:00","16:00","17:00","18:00"];
    const inicioDaSemana = startOfWeek(dataReferencia, { weekStartsOn: 1 });
    const diasDaSemana = Array.from({ length: 6 }).map((_, i) => addDays(inicioDaSemana, i));

    useEffect(() => {
        const carregar = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5022/api/Disponibilidade/minha', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const ids = res.data.map((s: any) => {
                    const d = new Date(s.dataHora);
                    return `${format(d, 'yyyy-MM-dd')}_${format(d, 'HH:mm')}`;
                });
                const unicos = [...new Set<string>(ids)];
                setSalvos(unicos);
                setSelecionados(unicos);
            } catch (err) {
                console.error("Erro ao carregar disponibilidade", err);
            }
        };
        carregar();
    }, [dataReferencia]);

    const toggle = (dia: Date, hora: string) => {
        const id = `${format(dia, 'yyyy-MM-dd')}_${hora}`;
        setSelecionados(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleGravar = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const slots = selecionados.map(id => {
                const [data, hora] = id.split('_');
                return { dataHora: `${data}T${hora}:00` };
            });

            await axios.post(
                'http://localhost:5022/api/Disponibilidade/gravar',
                { slots },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSalvos([...selecionados]);
            alert("Disponibilidade gravada com sucesso!");
        } catch (err: any) {
            const msg = err.response?.data?.message || "Erro ao gravar.";
            alert(`Erro: ${msg}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            {/* Navegação Semanal */}
            <div className="bg-slate-900/50 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-lg flex items-center justify-between text-white">
                <button onClick={() => setDataReferencia(subWeeks(dataReferencia, 1))} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition">◀</button>
                <div className="text-center">
                    <p className="text-[10px] text-indigo-300 font-black uppercase tracking-widest mb-1">A Minha Disponibilidade</p>
                    <h3 className="font-bold text-lg">{format(diasDaSemana[0], "dd MMM", { locale: pt })} — {format(diasDaSemana[5], "dd MMM", { locale: pt })}</h3>
                </div>
                <button onClick={() => setDataReferencia(addWeeks(dataReferencia, 1))} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition">▶</button>
            </div>

            {/* Legenda */}
            <div className="flex gap-4 text-xs text-white/70 font-bold px-2">
                <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-emerald-500 inline-block"></span> Disponível
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-rose-500 inline-block"></span> Ocupado (com aluno)
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded border-2 border-dashed border-white/30 inline-block"></span> Livre
                </span>
            </div>

            {/* Grelha */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-x-auto">
                <table className="w-full border-separate border-spacing-2">
                    <thead>
                        <tr>
                            <th className="w-20"></th>
                            {diasDaSemana.map(dia => (
                                <th key={dia.toString()} className="pb-4">
                                    <p className="text-[10px] font-black text-gray-400 uppercase">{format(dia, 'eee', { locale: pt })}</p>
                                    <p className="text-2xl font-black text-indigo-900">{format(dia, 'dd')}</p>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {horas.map(h => (
                            <tr key={h}>
                                <td className="text-xs font-black text-gray-300 text-right pr-4 py-4">{h}</td>
                                {diasDaSemana.map(dia => {
                                    const id = `${format(dia, 'yyyy-MM-dd')}_${h}`;
                                    const isSelecionado = selecionados.includes(id);

                                    return (
                                        <td key={id} className="h-20 min-w-[110px]">
                                            <button
                                                onClick={() => toggle(dia, h)}
                                                className={`w-full h-full rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1
                                                    ${isSelecionado
                                                        ? 'bg-emerald-500 border-emerald-400 shadow-lg scale-[1.02]'
                                                        : 'border-dashed border-gray-100 bg-gray-50/50 hover:border-indigo-200'
                                                    }`}>
                                                {isSelecionado
                                                    ? <Check className="w-5 h-5 text-white" />
                                                    : <span className="text-gray-200 text-xl">+</span>
                                                }
                                            </button>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleGravar}
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 disabled:opacity-50 transition">
                        <Save className="w-5 h-5" />
                        {loading ? 'A Gravar...' : 'Gravar Disponibilidade'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CalendarioExplicador;