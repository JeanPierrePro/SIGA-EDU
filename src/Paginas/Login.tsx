import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setCarregando(true);
        setErro('');
        
        try {
            // Chamada ao backend na porta 5022
            const resposta = await axios.post('http://localhost:5022/api/auth/login', {
                email,
                password
            });

            // 1. Guardar o Token e o utilizador na sessão do navegador
            localStorage.setItem('token', resposta.data.token);
            localStorage.setItem('userEmail', email);
            
            // Pegamos os cargos vindos do servidor (se houver)
            const roles = resposta.data.roles || [];
            
            // 2. LÓGICA DE REDIRECIONAMENTO INTELIGENTE
            // Verificamos se é o teu email de admin ou se tem o cargo "Admin"
            const eAdmin = email === 'portuga0462016@gmail.com' || 
                           roles.some((r: string) => r.toLowerCase() === 'admin');

            if (eAdmin) {
                console.log("Acesso Admin concedido!");
                navigate('/admin');
            } 
            else if (roles.includes('Professor')) {
                // Se no futuro tiveres a rota /professor
                navigate('/professor');
            }
            else {
                // Para alunos ou outros utilizadores
                setErro('Área de aluno em desenvolvimento. Acesso restrito a administradores.');
            }

        } catch (err: any) {
            if (err.response && err.response.status === 401) {
                setErro('E-mail ou palavra-passe incorretos.');
            } else {
                setErro('Erro de ligação ao servidor. Verifique se o Backend está ativo.');
            }
            console.error("Erro detalhado:", err);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-900 p-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
                
                {/* Título do Portal */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                        SIGA <span className="text-blue-300">EDU</span>
                    </h1>
                    <p className="text-blue-100/70 text-sm italic">Gestão Escolar Inteligente</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Alerta de Erro */}
                    {erro && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm p-3 rounded-lg text-center animate-pulse">
                            {erro}
                        </div>
                    )}

                    {/* Campo de Email */}
                    <div>
                        <label className="block text-sm font-medium text-blue-100 mb-1">E-mail</label>
                        <input 
                            type="email" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            placeholder="exemplo@sigaedu.com"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    {/* Campo de Senha */}
                    <div>
                        <label className="block text-sm font-medium text-blue-100 mb-1">Palavra-passe</label>
                        <input 
                            type="password" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            placeholder="••••••••"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    {/* Botão de Submissão */}
                    <button 
                        type="submit" 
                        disabled={carregando}
                        className={`w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 transform active:scale-95 transition-all flex items-center justify-center ${carregando ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {carregando ? (
                            <span className="flex items-center">
                                <svg className="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full" viewBox="0 0 24 24"></svg>
                                A validar...
                            </span>
                        ) : 'Entrar no Portal'}
                    </button>
                </form>

                {/* Direitos Autorais */}
                <div className="mt-8 text-center border-t border-white/10 pt-6">
                    <p className="text-blue-200/50 text-xs">
                        &copy; 2026 Siga Edu - Sistema de Explicações
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;