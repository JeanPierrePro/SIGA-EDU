import React, { useState } from 'react';
import ListaAlunos from '../Entidades/aluno/ListaAlunos';
import FormAluno from '../Entidades/aluno/FormAluno';
import PerfilAluno from '../Entidades/aluno/PerfilAluno';

const AlunoPagina: React.FC = () => {
  const [alunos, setAlunos] = useState([
    { id: 1, nome: "Ana Martins", email: "ana@escola.pt", turma: "12ºA" },
    { id: 2, nome: "Bruno Costa", email: "bruno@escola.pt", turma: "10ºC" }
  ]);
  const [alunoAtivo, setAlunoAtivo] = useState<any>(null);
  const [mostrarForm, setMostrarForm] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">SIGA-EDU: Alunos</h1>
        <button onClick={() => setMostrarForm(true)} className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg">+ Novo Aluno</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {mostrarForm ? (
            <FormAluno onSuccess={(n) => { setAlunos([...alunos, {id: Date.now(), ...n}]); setMostrarForm(false); }} onCancel={() => setMostrarForm(false)} />
          ) : (
            <ListaAlunos alunos={alunos} onEliminar={(id) => setAlunos(alunos.filter(a => a.id !== id))} onSelecionar={setAlunoAtivo} />
          )}
        </div>
        <div>
          {alunoAtivo ? <PerfilAluno aluno={alunoAtivo} /> : <div className="p-10 border-2 border-dashed text-center text-gray-400 rounded-xl">Selecione um aluno para ver o perfil</div>}
        </div>
      </div>
    </div>
  );
};

export default AlunoPagina;