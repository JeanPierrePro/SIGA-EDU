import React, { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { pt } from 'date-fns/locale';

interface Sessao { id: number; disciplina: string; data: Date; hora: string; cor: string; }
interface Props { aluno: { id: number; nome: string; email: string; turma: string } }

const PerfilAluno: React.FC<Props> = ({ }) => {
  const [dataReferencia, setDataReferencia] = useState(new Date());
  const [sessaoTemp, setSessaoTemp] = useState<{data: Date, hora: string} | null>(null);
  const [disciplinaSel, setDisciplinaSel] = useState('');
  const [minhasSessoes, setMinhasSessoes] = useState<Sessao[]>([]);

  const coresDisciplinas: Record<string, string> = {
    "Português": "bg-rose-500", "Matemática": "bg-blue-500", "Físico química": "bg-violet-500",
    "Inglês": "bg-amber-500", "Francês": "bg-orange-500", "História e Geografia": "bg-emerald-600",
    "Biologia e Geologia": "bg-teal-600"
  };

  const horas = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
  const inicioDaSemana = startOfWeek(dataReferencia, { weekStartsOn: 1 });
  const diasDaSemana = Array.from({ length: 6 }).map((_, i) => addDays(inicioDaSemana, i));

  const confirmarMarcacao = () => {
    if (!disciplinaSel || !sessaoTemp) return;
    const nova = { id: Date.now(), disciplina: disciplinaSel, data: sessaoTemp.data, hora: sessaoTemp.hora, cor: coresDisciplinas[disciplinaSel] };
    setMinhasSessoes([...minhasSessoes, nova]);
    setSessaoTemp(null);
    setDisciplinaSel('');
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* NAVEGAÇÃO DE SEMANA COM SETAS */}
      <div className="bg-slate-700/50 p-4 rounded-[32px] border border-slate-600 shadow-xl flex items-center justify-between gap-6">
        <button 
          onClick={() => setDataReferencia(subWeeks(dataReferencia, 1))} 
          className="w-14 h-14 bg-slate-800 hover:bg-slate-600 rounded-3xl flex items-center justify-center transition-all shadow-lg border border-slate-600 text-slate-300 hover:text-white"
          title="Semana Anterior"
        >
          <span className="text-xl">◀</span>
        </button>
        
        <div className="flex-1 text-center bg-slate-900/20 p-4 rounded-3xl border border-slate-700/50">
          <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-1">Agenda Semanal</p>
          <h3 className="font-bold text-white text-base">
            {format(diasDaSemana[0], "dd 'de' MMMM", { locale: pt })} — {format(diasDaSemana[5], "dd 'de' MMMM", { locale: pt })}
          </h3>
        </div>

        <button 
          onClick={() => setDataReferencia(addWeeks(dataReferencia, 1))} 
          className="w-14 h-14 bg-slate-800 hover:bg-slate-600 rounded-3xl flex items-center justify-center transition-all shadow-lg border border-slate-600 text-blue-400 hover:text-blue-300"
          title="Próxima Semana"
        >
          <span className="text-xl">▶</span>
        </button>
      </div>

      {/* GRELHA DO CALENDÁRIO */}
      <div className="bg-slate-700/20 p-6 md:p-8 rounded-[40px] border border-slate-700/50 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-2">
            <thead>
              <tr>
                <th className="w-24"></th>
                {diasDaSemana.map(dia => (
                  <th key={dia.toString()} className="pb-6">
                    <p className="text-[11px] font-black text-slate-400 uppercase mb-1">{format(dia, 'eeee', { locale: pt })}</p>
                    <p className="text-2xl font-black text-white">{format(dia, 'dd')}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horas.map(h => (
                <tr key={h}>
                  {/* HORAS DESTAQUE TOTAL */}
                  <td className="text-lg font-black text-white text-right pr-6 py-4 opacity-100 select-none">
                    {h}
                  </td>
                  {diasDaSemana.map(dia => {
                    const sessao = minhasSessoes.find(s => isSameDay(s.data, dia) && s.hora === h);
                    const isSel = sessaoTemp && isSameDay(sessaoTemp.data, dia) && sessaoTemp.hora === h;

                    return (
                      <td key={dia.toString() + h} className="h-20 min-w-[130px]">
                        {sessao ? (
                          <div className={`${sessao.cor} text-white p-3 rounded-2xl h-full flex flex-col justify-center items-center shadow-lg group relative border-2 border-white/5`}>
                            <span className="text-[10px] font-black uppercase text-center leading-none tracking-tighter">{sessao.disciplina}</span>
                            <button 
                              onClick={() => setMinhasSessoes(minhasSessoes.filter(s => s.id !== sessao.id))} 
                              className="absolute inset-0 bg-red-600/90 opacity-0 group-hover:opacity-100 transition-all rounded-2xl flex items-center justify-center font-black text-[10px] tracking-widest shadow-inner"
                            >
                              CANCELAR
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setSessaoTemp({ data: dia, hora: h })}
                            className={`w-full h-full rounded-2xl border-2 transition-all
                              ${isSel ? 'border-cyan-400 bg-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 'border-slate-700/40 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-700/40'}`}
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* POP-UP MARCAÇÃO */}
      {sessaoTemp && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-slate-800 p-8 rounded-[40px] shadow-2xl border border-slate-600 max-w-sm w-full animate-in zoom-in duration-150">
            <h4 className="font-black text-white text-2xl mb-1 italic tracking-tighter">Agendar</h4>
            <p className="text-cyan-400 text-[10px] font-black uppercase mb-6 tracking-[0.2em]">
               {format(sessaoTemp.data, "dd 'de' MMMM", {locale: pt})} — {sessaoTemp.hora}
            </p>
            
            <select 
              className="w-full p-4 bg-slate-900 border-2 border-slate-700 text-white rounded-2xl mb-8 outline-none focus:border-cyan-500 font-bold appearance-none cursor-pointer"
              onChange={(e) => setDisciplinaSel(e.target.value)}
              value={disciplinaSel}
            >
              <option value="">Qual a disciplina?</option>
              {Object.keys(coresDisciplinas).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            
            <div className="grid grid-cols-2 gap-4">
              <button onClick={confirmarMarcacao} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-black py-4 rounded-2xl transition-all active:scale-95">MARCAR</button>
              <button onClick={() => setSessaoTemp(null)} className="bg-slate-700 text-slate-400 font-bold py-4 rounded-2xl hover:bg-slate-600 transition-all uppercase text-xs tracking-widest">Sair</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfilAluno;