import React from 'react';

const PerfilAluno: React.FC = () => {
    const userEmail = localStorage.getItem('userEmail') || 'aluno@sigaedu.com';

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto mt-8">
            <h3 className="text-2xl font-bold text-indigo-900 mb-6">O Meu Perfil</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Nome Completo</label>
                    <input type="text" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="Geraldo Estudante" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">E-mail</label>
                    <input type="email" disabled className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed" value={userEmail} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Ano / Turma</label>
                    <input type="text" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="12º Ano - Turma A" />
                </div>
                <button className="mt-4 w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                    Atualizar Dados
                </button>
            </div>
        </div>
    );
};

export default PerfilAluno;