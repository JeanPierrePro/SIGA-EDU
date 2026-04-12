import React, { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { pt } from 'date-fns/locale';

interface Sessao { id: number; disciplina: string; data: Date; hora: string; cor: string; professor: string; }

const CalendarioSessoes: React.FC = () => {
    const [dataReferencia, setDataReferencia] = useState(new Date());
    const [sessaoTemp, setSessaoTemp] = useState<{data: Date, hora: string} | null>(null);
    const [disciplinaSel, setDisciplinaSel] = useState('');
    const [minhasSessoes, setMinhasSessoes] = useState<Sessao[]>([]);

    const coresDisciplinas: Record<string, string> = {
        "Matemática": "bg-blue-500", "Físico-Química": "bg-indigo-500",
        "Português": "bg-rose-500", "Inglês": "bg-amber-500", "Biologia": "bg-teal-600"
    };

    const professores: Record<string, string> = {
        "Matemática": "Prof. Carlos", "Físico-Química": "Prof. Carlos",
        "Português": "Profª. Maria", "Inglês": "Prof. John", "Biologia": "Profª. Ana"
    };

    const horas = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
    const inicioDaSemana = startOfWeek(dataReferencia, { weekStartsOn: 1 });
    const diasDaSemana = Array.from({ length: 6 }).map((_, i) => addDays(inicioDaSemana, i));

    const confirmarMarcacao = () => {
        if (!disciplinaSel || !sessaoTemp) return;
        const nova = { 
            id: Date.now(), disciplina: disciplinaSel, data: sessaoTemp.data, 
            hora: sessaoTemp.hora, cor: coresDisciplinas[disciplinaSel], professor: professores[disciplinaSel]
        };
        setMinhasSessoes([...minhasSessoes, nova]);
        setSessaoTemp(null); setDisciplinaSel('');
    };

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            {/* Navegação Semanal */}
            <div className="bg-indigo-900 p-4 rounded-3xl shadow-lg flex items-center justify-between gap-6 text-white">
                <button onClick={() => setDataReferencia(subWeeks(dataReferencia, 1))} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition">◀</button>
                <div className="text-center">
                    <p className="text-xs text-blue-300 font-bold uppercase tracking-widest mb-1">A Minha Agenda</p>
                    <h3 className="font-bold text-lg">{format(diasDaSemana[0], "dd 'de' MMMM", { locale: pt })} — {format(diasDaSemana[5], "dd 'de' MMMM", { locale: pt })}</h3>
                </div>
                <button onClick={() => setDataReferencia(addWeeks(dataReferencia, 1))} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition">▶</button>
            </div>

            {/* Grelha do Calendário */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl overflow-x-auto">
                <table className="w-full border-separate border-spacing-2">
                    <thead>
                        <tr>
                            <th className="w-20"></th>
                            {diasDaSemana.map(dia => (
                                <th key={dia.toString()} className="pb-4">
                                    <p className="text-xs font-bold text-gray-400 uppercase">{format(dia, 'eeee', { locale: pt })}</p>
                                    <p className="text-2xl font-black text-indigo-900">{format(dia, 'dd')}</p>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {horas.map(h => (
                            <tr key={h}>
                                <td className="text-sm font-bold text-gray-400 text-right pr-4 py-4">{h}</td>
                                {diasDaSemana.map(dia => {
                                    const sessao = minhasSessoes.find(s => isSameDay(s.data, dia) && s.hora === h);
                                    const isSel = sessaoTemp && isSameDay(sessaoTemp.data, dia) && sessaoTemp.hora === h;
                                    return (
                                        <td key={dia.toString() + h} className="h-20 min-w-[120px]">
                                            {sessao ? (
                                                <div className={`${sessao.cor} text-white p-2 rounded-xl h-full flex flex-col justify-center items-center shadow-md relative group cursor-pointer`}>
                                                    <span className="text-[10px] font-bold uppercase">{sessao.disciplina}</span>
                                                    <span className="text-[9px] opacity-80">{sessao.professor}</span>
                                                    <button onClick={() => setMinhasSessoes(minhasSessoes.filter(s => s.id !== sessao.id))} className="absolute inset-0 bg-red-600/90 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center text-[10px] font-bold tracking-wider">CANCELAR</button>
                                                </div>
                                            ) : (
                                                <button onClick={() => setSessaoTemp({ data: dia, hora: h })} className={`w-full h-full rounded-xl border-2 transition-all border-dashed ${isSel ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/50'}`}>{isSel ? 'Selecionado' : '+'}</button>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de Marcação */}
            {sessaoTemp && (
                <div className="fixed inset-0 bg-indigo-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full">
                        <h4 className="font-bold text-indigo-900 text-2xl mb-1">Agendar Apoio</h4>
                        <p className="text-blue-600 text-xs font-bold uppercase mb-6">{format(sessaoTemp.data, "dd 'de' MMMM", {locale: pt})} às {sessaoTemp.hora}</p>
                        <select className="w-full p-4 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl mb-8 outline-none focus:ring-2 focus:ring-blue-500 font-medium" onChange={(e) => setDisciplinaSel(e.target.value)} value={disciplinaSel}>
                            <option value="">Escolher Disciplina...</option>
                            {Object.keys(coresDisciplinas).map(d => <option key={d} value={d}>{d} (com {professores[d]})</option>)}
                        </select>
                        <div className="flex space-x-3">
                            <button onClick={() => setSessaoTemp(null)} className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition">Cancelar</button>
                            <button onClick={confirmarMarcacao} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-200">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarioSessoes;