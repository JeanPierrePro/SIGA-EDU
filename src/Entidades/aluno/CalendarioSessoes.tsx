import React, { useState } from 'react';

const CalendarioSessoes: React.FC = () => {
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [erro, setErro] = useState('');

  const validarEAgendar = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!data || !hora) {
      setErro("Por favor, selecione a data e a hora.");
      return;
    }

    // Converter hora para número para validar o almoço
    const [h, m] = hora.split(':').map(Number);
    const horaDecimal = h + m / 60;

    // Regra: Bloqueio entre as 13:00 e as 14:00
    if (horaDecimal >= 13 && horaDecimal < 14) {
      setErro("Horário indisponível: Pausa para almoço (13:00 - 14:00).");
      return;
    }

    console.log("Agendamento para:", data, "às", hora);
    alert("Sessão agendada com sucesso para " + data + " às " + hora);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6">
      <div className="flex items-center mb-4 text-green-700">
        <h3 className="text-xl font-bold">Marcar Nova Explicação</h3>
      </div>
      
      <form onSubmit={validarEAgendar} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data da Sessão</label>
            <input 
              type="date" 
              className="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-green-500 focus:border-green-500"
              onChange={(e) => setData(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora de Início</label>
            <input 
              type="time" 
              className="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-green-500 focus:border-green-500"
              onChange={(e) => setHora(e.target.value)}
            />
          </div>
        </div>

        {erro && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200 flex items-center">
            <span className="mr-2">⚠️</span> {erro}
          </div>
        )}

        <button 
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm"
        >
          Confirmar Marcação
        </button>
      </form>

      <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
        <p className="text-xs text-amber-800">
          <strong>Aviso de Horário:</strong> Conforme as regras da instituição, não são permitidos agendamentos durante o período de almoço das 13h00 às 14h00.
        </p>
      </div>
    </div>
  );
};

export default CalendarioSessoes;