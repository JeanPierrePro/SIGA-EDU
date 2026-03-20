import React from 'react';

interface Aluno {
  id: number;
  nome: string;
  email: string;
  turma: string;
}

interface ListaProps {
  alunos: Aluno[];
  onEliminar: (id: number) => void;
  onSelecionar: (aluno: Aluno) => void;
}

const ListaAlunos: React.FC<ListaProps> = ({ alunos, onEliminar, onSelecionar }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nome</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Turma</th>
            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {alunos.map((aluno) => (
            <tr key={aluno.id} className="hover:bg-blue-50 transition">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{aluno.nome}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{aluno.turma}</td>
              <td className="px-6 py-4 text-right text-sm">
                <button 
                  onClick={() => onSelecionar(aluno)}
                  className="text-blue-600 hover:text-blue-900 mr-4 font-semibold"
                >
                  Ver Perfil
                </button>
                <button 
                  onClick={() => onEliminar(aluno.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaAlunos;