import React from 'react';

const PerfilAdmin: React.FC = () => {
    const userEmail = localStorage.getItem('userEmail') || 'admin@sigaedu.com';

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto mt-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Configurações de Conta</h3>
            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Nome do Administrador</label>
                    <input type="text" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" defaultValue="Geraldo Admin" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">E-mail de Acesso</label>
                    <input type="email" disabled className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed" value={userEmail} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Telemóvel (Opcional)</label>
                    <input type="text" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="+351 900 000 000" />
                </div>
                
                <div className="pt-4 border-t border-gray-100 mt-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Nova Palavra-passe</label>
                    <input type="password" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Deixar em branco para não alterar" />
                </div>
                
                <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-200 active:scale-95">
                    Guardar Alterações
                </button>
            </div>
        </div>
    );
};

export default PerfilAdmin;