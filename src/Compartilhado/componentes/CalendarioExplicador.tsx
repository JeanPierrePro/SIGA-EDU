import React, { useState, useEffect, useRef, useCallback } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isToday } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Check, Save, User, X, AlertTriangle } from 'lucide-react';
import axios from 'axios';

interface SlotInfo {
    id: number;
    dataHora: string;
    materia: string;
    isOcupado: boolean;
    alunoNome: string | null;
    alunoEmail: string | null;
}

interface ModalConfirmacao {
    tipo: 'retirar' | 'cancelar-sessao';
    slot: SlotInfo;
}

const CalendarioExplicador: React.FC<{ onNovasSessoes?: (count: number) => void }> = ({ onNovasSessoes }) => {
    const [dataReferencia, setDataReferencia] = useState(new Date());
    const [selecionados, setSelecionados] = useState<string[]>([]);
    const [slotsOcupados, setSlotsOcupados] = useState<SlotInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [carregando, setCarregando] = useState(true);
    const [modalConfirm, setModalConfirm] = useState<ModalConfirmacao | null>(null);
    const hojeRef = useRef<HTMLTableCellElement>(null);

    const horas = ["09:00","10:00","11:00","12:00","14:00","15:00","16:00","17:00","18:00"];
    const inicioDaSemana = startOfWeek(dataReferencia, { weekStartsOn: 1 });
    const diasDaSemana = Array.from({ length: 6 }).map((_, i) => addDays(inicioDaSemana, i));

    const isPassado = (dia: Date, hora: string) => {
        const [h, m] = hora.split(':').map(Number);
        const dataHora = new Date(dia);
        dataHora.setHours(h, m, 0, 0);
        return dataHora < new Date();
    };

    // Scroll para hoje apenas no primeiro render
    useEffect(() => {
        setTimeout(() => {
            hojeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }, 400);
    }, []);

    const carregar = useCallback(async () => {
        setCarregando(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await axios.get('http://localhost:5022/api/Disponibilidade/minha', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const todos: SlotInfo[] = res.data;

            const ids = todos
                .filter(s => !s.isOcupado)
                .map(s => {
                    const d = new Date(s.dataHora);
                    return `${format(d, 'yyyy-MM-dd')}_${format(d, 'HH:mm')}`;
                });
            setSelecionados([...new Set<string>(ids)]);
            setSlotsOcupados(todos.filter(s => s.isOcupado));
            onNovasSessoes?.(todos.filter(s => s.isOcupado).length);
        } catch (err) {
            console.error("Erro ao carregar disponibilidade", err);
        } finally {
            setCarregando(false);
        }
    }, [dataReferencia]);

    useEffect(() => { carregar(); }, [carregar]);

    const toggle = (dia: Date, hora: string) => {
        if (isPassado(dia, hora)) return;
        const id = `${format(dia, 'yyyy-MM-dd')}_${hora}`;
        const isOcupado = slotsOcupados.some(s => {
            const d = new Date(s.dataHora);
            return `${format(d, 'yyyy-MM-dd')}_${format(d, 'HH:mm')}` === id;
        });
        if (isOcupado) return;
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
            alert("Disponibilidade gravada com sucesso!");
            await carregar();
        } catch (err: any) {
            alert(`Erro: ${err.response?.data?.message || "Erro ao gravar."}`);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmarCancelamento = async () => {
        if (!modalConfirm) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const endpoint = modalConfirm.tipo === 'cancelar-sessao'
                ? 'cancelar-sessao'
                : 'retirar-disponibilidade';

            await axios.post(
                `http://localhost:5022/api/Disponibilidade/${endpoint}`,
                { disponibilidadeId: modalConfirm.slot.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setModalConfirm(null);
            await carregar();
        } catch (err: any) {
            alert(err.response?.data?.message || "Erro ao cancelar.");
        } finally {
            setLoading(false);
        }
    };

    const getSlotOcupado = (dia: Date, hora: string) =>
        slotsOcupados.find(s => {
            const d = new Date(s.dataHora);
            return format(d, 'yyyy-MM-dd') === format(dia, 'yyyy-MM-dd')
                && format(d, 'HH:mm') === hora;
        });

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            {/* Navegação */}
            <div className="bg-slate-900/50 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-lg flex items-center justify-between text-white">
                <button onClick={() => setDataReferencia(subWeeks(dataReferencia, 1))}
                    className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition">◀</button>
                <div className="text-center">
                    <p className="text-[10px] text-indigo-300 font-black uppercase tracking-widest mb-1">A Minha Disponibilidade</p>
                    <h3 className="font-bold text-lg">
                        {format(diasDaSemana[0], "dd MMM", { locale: pt })} — {format(diasDaSemana[5], "dd MMM", { locale: pt })}
                    </h3>
                </div>
                <button onClick={() => setDataReferencia(addWeeks(dataReferencia, 1))}
                    className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition">▶</button>
            </div>

            {/* Legenda */}
            <div className="flex gap-4 text-xs text-white/70 font-bold px-2 flex-wrap">
                <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-emerald-500 inline-block"></span> Disponível</span>
                <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-rose-500 inline-block"></span> Ocupado</span>
                <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-gray-300 inline-block"></span> Passado</span>
            </div>

            {/* Banner sessões ocupadas */}
            {slotsOcupados.length > 0 && (
                <div className="bg-rose-500/20 border border-rose-400/30 rounded-2xl p-4 text-white">
                    <p className="text-xs font-black uppercase tracking-widest text-rose-300 mb-2">
                        🔔 Tens {slotsOcupados.length} sessão(ões) marcada(s) por alunos
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {slotsOcupados.map(s => (
                            <span key={s.id} className="bg-rose-500/30 text-rose-200 text-xs font-bold px-3 py-1 rounded-full">
                                {format(new Date(s.dataHora), "EEE dd/MM 'às' HH:mm", { locale: pt })} — {s.alunoNome}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Grelha */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-x-auto">
                {carregando ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        <span className="ml-3 text-gray-400 font-bold text-sm">A carregar agenda...</span>
                    </div>
                ) : (
                    <table className="w-full border-separate border-spacing-2">
                        <thead>
                            <tr>
                                <th className="w-20"></th>
                                {diasDaSemana.map(dia => {
                                    const hoje = isToday(dia);
                                    return (
                                        <th key={dia.toString()} className="pb-4"
                                            ref={hoje ? (hojeRef as React.RefObject<HTMLTableCellElement>) : undefined}>
                                            <p className="text-[10px] font-black text-gray-400 uppercase">{format(dia, 'eee', { locale: pt })}</p>
                                            <p className={`text-2xl font-black ${hoje ? 'text-indigo-500' : 'text-indigo-900'}`}>{format(dia, 'dd')}</p>
                                            {hoje && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mx-auto mt-1"></div>}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {horas.map(h => (
                                <tr key={h}>
                                    <td className="text-xs font-black text-gray-300 text-right pr-4 py-4">{h}</td>
                                    {diasDaSemana.map(dia => {
                                        const id = `${format(dia, 'yyyy-MM-dd')}_${h}`;
                                        const isSelecionado = selecionados.includes(id);
                                        const slotOcupado = getSlotOcupado(dia, h);
                                        const passado = isPassado(dia, h);

                                        return (
                                            <td key={id} className="h-20 min-w-[110px]">
                                                {slotOcupado ? (
                                                    <button
                                                        onClick={() => setModalConfirm({ tipo: 'cancelar-sessao', slot: slotOcupado })}
                                                        className="bg-rose-500 hover:bg-rose-600 text-white p-2 rounded-2xl w-full h-full flex flex-col justify-center items-center shadow-lg transition group">
                                                        <User className="w-4 h-4 mb-1 opacity-80" />
                                                        <span className="text-[10px] font-black uppercase text-center leading-tight">
                                                            {slotOcupado.alunoNome || "Aluno"}
                                                        </span>
                                                        <span className="text-[9px] opacity-70 mt-1">{slotOcupado.materia}</span>
                                                        <span className="text-[8px] opacity-0 group-hover:opacity-100 transition mt-1 bg-white/20 px-2 py-0.5 rounded-full">
                                                            Cancelar
                                                        </span>
                                                    </button>
                                                ) : passado ? (
                                                    <div className="w-full h-full rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-300 text-xs font-bold">—</span>
                                                    </div>
                                                ) : isSelecionado ? (
                                                    <button onClick={() => toggle(dia, h)}
                                                        className="w-full h-full rounded-2xl border-2 bg-emerald-500 border-emerald-400 shadow-lg scale-[1.02] flex flex-col items-center justify-center gap-1 transition">
                                                        <Check className="w-5 h-5 text-white" />
                                                    </button>
                                                ) : (
                                                    <button onClick={() => toggle(dia, h)}
                                                        className="w-full h-full rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/50 hover:border-indigo-200 transition flex flex-col items-center justify-center">
                                                        <span className="text-gray-200 text-xl">+</span>
                                                    </button>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {!carregando && (
                    <div className="mt-8 flex justify-end">
                        <button onClick={handleGravar} disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 disabled:opacity-50 transition">
                            <Save className="w-5 h-5" />
                            {loading ? 'A Gravar...' : 'Gravar Disponibilidade'}
                        </button>
                    </div>
                )}
            </div>

            {/* Modal confirmação */}
            {modalConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                                </div>
                                <h4 className="font-black text-gray-900 text-lg">
                                    {modalConfirm.tipo === 'cancelar-sessao' ? 'Cancelar Sessão' : 'Retirar Disponibilidade'}
                                </h4>
                            </div>
                            <button onClick={() => setModalConfirm(null)} className="text-gray-400 hover:text-red-500 transition">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                            <p className="text-sm font-bold text-gray-600">
                                {format(new Date(modalConfirm.slot.dataHora), "EEEE, dd 'de' MMMM 'às' HH:mm", { locale: pt })}
                            </p>
                            {modalConfirm.tipo === 'cancelar-sessao' && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Aluno: <span className="font-bold text-gray-700">{modalConfirm.slot.alunoNome}</span>
                                </p>
                            )}
                            <p className="text-sm text-gray-500 mt-1">
                                Matéria: <span className="font-bold text-gray-700">{modalConfirm.slot.materia}</span>
                            </p>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">
                            {modalConfirm.tipo === 'cancelar-sessao'
                                ? 'Tens a certeza que queres cancelar esta sessão? O slot ficará disponível novamente.'
                                : 'Tens a certeza que queres retirar esta disponibilidade?'
                            }
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setModalConfirm(null)}
                                className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition">
                                Não, voltar
                            </button>
                            <button onClick={handleConfirmarCancelamento} disabled={loading}
                                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl transition shadow-lg disabled:opacity-50">
                                {loading ? 'A cancelar...' : 'Sim, cancelar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarioExplicador;