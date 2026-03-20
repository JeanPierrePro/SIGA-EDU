import React, { useState } from 'react';

interface FormProps {
  onSuccess: (novo: any) => void;
  onCancel: () => void;
}

const FormAluno: React.FC<FormProps> = ({ onSuccess, onCancel }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [turma, setTurma] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !turma) return alert("Preencha tudo!");
    onSuccess({ nome, email, turma });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl border-2 border-blue-100 space-y-4">
      <h3 className="text-lg font-bold text-blue-800">Novo Registo de Aluno</h3>
      <input type="text" placeholder="Nome" className="w-full p-2 border rounded" onChange={e => setNome(e.target.value)} />
      <input type="email" placeholder="Email" className="w-full p-2 border rounded" onChange={e => setEmail(e.target.value)} />
      <input type="text" placeholder="Turma (ex: 12ºA)" className="w-full p-2 border rounded" onChange={e => setTurma(e.target.value)} />
      <div className="flex space-x-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
        <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
      </div>
    </form>
  );
};

export default FormAluno;