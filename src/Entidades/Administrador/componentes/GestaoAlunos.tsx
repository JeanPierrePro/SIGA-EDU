import React, { useState, useEffect } from 'react';
import { UserPlus, Edit2, Trash2, X, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

// O "molde" dos dados que o C# nos vai enviar
interface Aluno {
    id: number;
    nome: string;
    email: string;
    dataInscricao: string;
}

const GestaoAlunos: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Estados para a Tabela
    const [listaAlunos, setListaAlunos] = useState<Aluno[]>([]);
    const [carregandoLista, setCarregandoLista] = useState(true);

    // Estados para o Formulário
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    // FUNÇÃO: Ir buscar a lista de alunos ao Supabase (via C#)
    const fetchAlunos = async () => {
        try {
            const token = localStorage.getItem('token');
            const resposta = await axios.get('http://localhost:5022/api/admin/alunos', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setListaAlunos(resposta.data);
        } catch (error) {
            console.error("Erro ao buscar alunos:", error);
        } finally {
            setCarregandoLista(false);
        }
    };

    // Assim que o ecrã abre, ele chama a função fetchAlunos
    useEffect(() => {
        fetchAlunos();
    }, []);

    // FUNÇÃO: Enviar novo aluno para o Supabase (via C#)
    const handleRegistar = async (e: React.FormEvent) => {
        e.preventDefault();
        setCarregando(true);
        setErro('');
        setSucesso('');

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5022/api/admin/criar-membro', {
                Nome: nome,
                Email: email,
                Password: password,
                Role: 'Aluno'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSucesso('Aluno registado com sucesso!');
            setNome(''); setEmail(''); setPassword('');
            
            // 🔄 Atualiza a tabela imediatamente após criar!
            fetchAlunos();

            setTimeout(() => {
                setIsModalOpen(false);
                setSucesso('');
            }, 2000);

        } catch (err: any) {
            console.error("Erro ao registar:", err);
            if (err.response && err.response.data) {
                setErro('Erro: Palavra-passe fraca ou e-mail já existe.');
            } else {
                setErro('Erro de ligação ao servidor.');
            }
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
            <div className="p-5 border-b flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-700">Lista de Alunos</h3>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-md shadow-blue-200 active:scale-95">
                    <UserPlus className="w-4 h-4" /> <span>Registar Aluno</span>
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-400 font-bold">
                        <tr>
                            <th className="px-6 py-4">Nome do Aluno</th>
                            <th className="px-6 py-4">E-mail</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {carregandoLista ? (
                            <tr>
                                <td colSpan={3} className="text-center py-10 text-gray-400">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                                    A carregar alunos da base de dados...
                                </td>
                            </tr>
                        ) : listaAlunos.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="text-center py-10 text-gray-400 font-medium">
                                    Nenhum aluno registado ainda no sistema.
                                </td>
                            </tr>
                        ) : (
                            listaAlunos.map((aluno) => (
                                <tr key={aluno.id} className="hover:bg-blue-50/50 transition">
                                    <td className="px-6 py-4 font-bold text-gray-700">{aluno.nome}</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{aluno.email}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-500 hover:bg-blue-100 p-2 rounded-lg mr-2 transition" title="Editar"><Edit2 className="w-4 h-4" /></button>
                                        <button className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* POP-UP MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-indigo-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition">
                            <X className="w-6 h-6" />
                        </button>
                        <h4 className="font-bold text-gray-800 text-2xl mb-1 tracking-tight">Novo Aluno</h4>
                        <p className="text-gray-500 text-xs font-medium mb-6">Registe os dados de acesso para o portal.</p>
                        
                        <form onSubmit={handleRegistar} className="space-y-4">
                            {erro && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 font-medium">{erro}</div>}
                            {sucesso && <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm border border-green-100 font-medium flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {sucesso}</div>}

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
                                <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">E-mail</label>
                                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Palavra-passe Provisória</label>
                                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                            </div>

                            <button type="submit" disabled={carregando} className={`w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-200 flex justify-center items-center gap-2 ${carregando ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}>
                                {carregando ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                                <span>Criar Conta de Aluno</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestaoAlunos;