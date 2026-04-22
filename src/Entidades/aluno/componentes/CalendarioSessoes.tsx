import React, { useState, useEffect, useRef, useCallback } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isToday } from 'date-fns';
import { pt } from 'date-fns/locale';
import { X, AlertTriangle } from 'lucide-react';
import axios from 'axios';

interface SlotDisponivel {
    id: number;
    dataHora: string;
    materia: string;
    explicadorNome: string;
    explicadorId: number;
}

interface SessaoMarcada {
    id: number;
    dataHora: string;
    materia: string;
    explicadorNome: string;
}

interface MateriaComProfessores {
    materia: string;
    professores: { id: number; nome: string }[];
}

const CalendarioSessoes: React.FC = () => {
    const [dataReferencia, setDataReferencia] = useState(new Date());
    const [slotsDisponiveis, setSlotsDisponiveis] = useState<SlotDisponivel[]>([]);
    const [minhasSessoes, setMinhasSessoes] = useState<SessaoMarcada[]>([]);
    const [modalInfo, setModalInfo] = useState<{ dataHora: Date; materias: MateriaComProfessores[] } | null>(null);
    const [modalCancelar, setModalCancelar] = useState<SessaoMarcada | null>(null);
    const [loading, setLoading] = useState(false);
    const [carregando, setCarregando] = useState(true);
    const hojeRef = useRef<HTMLTableCellElement>(null);

    const horas = ["09:00","10:00","11:00","12:00","14:00","15:00","16:00","17:00","18:00"];
    
    // Calculado a partir do state — estável
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

    // carregarDados com useCallback para ser estável
    const carregarDados = useCallback(async () => {
        setCarregando(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            
            const headers = { Authorization: `Bearer ${token}` };
            const inicio = startOfWeek(dataReferencia, { weekStartsOn: 1 });

            const [resSlots, resSessoes] = await Promise.all([
                axios.get(
                    `http://localhost:5022/api/Disponibilidade/todos-disponiveis?inicioSemana=${inicio.toISOString()}`,
                    { headers }
                ),
                axios.get('http://localhost:5022/api/Disponibilidade/minhas-sessoes', { headers })
            ]);

            setSlotsDisponiveis(resSlots.data);
            setMinhasSessoes(resSessoes.data);
        } catch (err) {
            console.error("Erro ao carregar dados", err);
        } finally {
            setCarregando(false);
        }
    }, [dataReferencia]); // Re-executa quando dataReferencia muda

    // Carrega sempre que dataReferencia muda OU ao montar (F5)
    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    const handleClicarSlot = async (dia: Date, hora: string) => {
        if (isPassado(dia, hora)) return;
        const dataHora = new Date(`${format(dia, 'yyyy-MM-dd')}T${hora}:00`);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                `http://localhost:5022/api/Disponibilidade/materias-disponiveis?dataHora=${dataHora.toISOString()}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.length === 0) return;
            setModalInfo({ dataHora, materias: res.data });
        } catch (err) {
            console.error("Erro ao carregar matérias", err);
        }
    };

    const handleMarcar = async (disponibilidadeId: number) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5022/api/Disponibilidade/marcar',
                { disponibilidadeId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Sessão marcada com sucesso!");
            setModalInfo(null);
            await carregarDados();
        } catch (err: any) {
            alert(err.response?.data?.message || "Erro ao marcar sessão.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelarSessao = async () => {
        if (!modalCancelar) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5022/api/Disponibilidade/cancelar-sessao',
                { disponibilidadeId: modalCancelar.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setModalCancelar(null);
            await carregarDados();
        } catch (err: any) {
            alert(err.response?.data?.message || "Erro ao cancelar.");
        } finally {
            setLoading(false);
        }
    };

    const temDisponivel = (dia: Date, hora: string) => {
        if (isPassado(dia, hora)) return false;
        return slotsDisponiveis.some(s => {
            const d = new Date(s.dataHora);
            return format(d, 'yyyy-MM-dd') === format(dia, 'yyyy-MM-dd')
                && format(d, 'HH:mm') === hora;
        });
    };

    const temSessao = (dia: Date, hora: string) =>
        minhasSessoes.find(s => {
            const d = new Date(s.dataHora);
            return format(d, 'yyyy-MM-dd') === format(dia, 'yyyy-MM-dd')
                && format(d, 'HH:mm') === hora;
        });

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            {/* Navegação */}
            <div className="bg-indigo-900 p-4 rounded-3xl shadow-lg flex items-center justify-between text-white">
                <button onClick={() => setDataReferencia(subWeeks(dataReferencia, 1))}
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition">◀</button>
                <div className="text-center">
                    <p className="text-xs text-blue-300 font-bold uppercase tracking-widest mb-1">A Minha Agenda</p>
                    <h3 className="font-bold text-lg">
                        {format(diasDaSemana[0], "dd 'de' MMMM", { locale: pt })} — {format(diasDaSemana[5], "dd 'de' MMMM", { locale: pt })}
                    </h3>
                </div>
                <button onClick={() => setDataReferencia(addWeeks(dataReferencia, 1))}
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition">▶</button>
            </div>

            {/* Legenda */}
            <div className="flex gap-6 text-xs font-bold text-gray-500 px-2 flex-wrap">
                <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-emerald-500 inline-block"></span> Disponível</span>
                <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-blue-500 inline-block"></span> Sessão marcada — clica para cancelar</span>
                <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-gray-200 inline-block"></span> Passado</span>
            </div>

            {/* Grelha */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl overflow-x-auto">
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
                                            <p className="text-xs font-bold text-gray-400 uppercase">{format(dia, 'eeee', { locale: pt })}</p>
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
                                    <td className="text-sm font-bold text-gray-400 text-right pr-4 py-4">{h}</td>
                                    {diasDaSemana.map(dia => {
                                        const sessao = temSessao(dia, h);
                                        const disponivel = temDisponivel(dia, h);
                                        const passado = isPassado(dia, h);

                                        return (
                                            <td key={dia.toString() + h} className="h-20 min-w-[120px]">
                                                {sessao ? (
                                                    <button onClick={() => setModalCancelar(sessao)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-xl w-full h-full flex flex-col justify-center items-center shadow-md transition group">
                                                        <span className="text-[10px] font-bold uppercase">{sessao.materia}</span>
                                                        <span className="text-[9px] opacity-80">{sessao.explicadorNome}</span>
                                                        <span className="text-[8px] opacity-0 group-hover:opacity-100 transition mt-1 bg-white/20 px-2 py-0.5 rounded-full">
                                                            Cancelar
                                                        </span>
                                                    </button>
                                                ) : passado ? (
                                                    <div className="w-full h-full rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-300 text-xs font-bold">—</span>
                                                    </div>
                                                ) : disponivel ? (
                                                    <button onClick={() => handleClicarSlot(dia, h)}
                                                        className="w-full h-full rounded-xl border-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 transition flex flex-col items-center justify-center gap-1">
                                                        <span className="text-emerald-600 text-[10px] font-black uppercase">Disponível</span>
                                                        <span className="text-emerald-400 text-xs">Marcar +</span>
                                                    </button>
                                                ) : (
                                                    <div className="w-full h-full rounded-xl border-2 border-dashed border-gray-100 bg-gray-50/30"></div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal marcar sessão */}
            {modalInfo && (
                <div className="fixed inset-0 bg-indigo-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-black text-indigo-900 text-xl">Marcar Apoio</h4>
                            <button onClick={() => setModalInfo(null)} className="text-gray-400 hover:text-red-500 transition"><X /></button>
                        </div>
                        <p className="text-indigo-400 text-xs font-bold uppercase mb-6">
                            {format(modalInfo.dataHora, "EEEE, dd 'de' MMMM 'às' HH:mm", { locale: pt })}
                        </p>
                        <div className="space-y-3">
                            {modalInfo.materias.map(m => (
                                <div key={m.materia} className="border border-gray-100 rounded-2xl p-4">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">{m.materia}</p>
                                    <div className="space-y-2">
                                        {m.professores.map(prof => (
                                            <button key={prof.id} onClick={() => handleMarcar(prof.id)} disabled={loading}
                                                className="w-full flex items-center justify-between bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 px-4 py-3 rounded-xl font-bold text-sm transition disabled:opacity-50">
                                                <span>{prof.nome}</span>
                                                <span className="text-xs opacity-70">Marcar →</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal cancelar sessão */}
            {modalCancelar && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                                </div>
                                <h4 className="font-black text-gray-900 text-lg">Cancelar Sessão</h4>
                            </div>
                            <button onClick={() => setModalCancelar(null)} className="text-gray-400 hover:text-red-500 transition">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                            <p className="text-sm font-bold text-gray-600">
                                {format(new Date(modalCancelar.dataHora), "EEEE, dd 'de' MMMM 'às' HH:mm", { locale: pt })}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Professor: <span className="font-bold text-gray-700">{modalCancelar.explicadorNome}</span>
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Matéria: <span className="font-bold text-gray-700">{modalCancelar.materia}</span>
                            </p>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">Tens a certeza que queres cancelar esta sessão?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setModalCancelar(null)}
                                className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition">
                                Não, voltar
                            </button>
                            <button onClick={handleCancelarSessao} disabled={loading}
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

export default CalendarioSessoes;