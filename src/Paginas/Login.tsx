import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldAlert, Loader2 } from 'lucide-react';

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
            const resposta = await axios.post('http://localhost:5022/api/auth/login', {
                email,
                password
            });

            // SALVAMOS OS DADOS
            localStorage.setItem('token', resposta.data.token);
            localStorage.setItem('userEmail', email);
            
            // 🔎 DIAGNÓSTICO: Vamos ver o que o C# mandou exatamente
            console.log("RESPOSTA COMPLETA DO SERVIDOR:", resposta.data);
            
            // Tentamos pegar o cargo de várias formas (array ou string única)
            const rolesEnviadas = resposta.data.roles || (resposta.data.role ? [resposta.data.role] : []);
            
            console.log("CARGOS DETECTADOS:", rolesEnviadas);

            // BÚSSOLA DE REDIRECIONAMENTO (Super tolerante)
            const isAdmin = rolesEnviadas.some((r: string) => r.toLowerCase() === 'admin') || email === 'portuga0462016@gmail.com';
            const isExplicador = rolesEnviadas.some((r: string) => r.toLowerCase() === 'explicador');
            const isAluno = rolesEnviadas.some((r: string) => r.toLowerCase() === 'aluno');

            if (isAdmin) {
                navigate('/admin');
            } 
            else if (isExplicador) {
                navigate('/professor');
            }
            else if (isAluno) {
                navigate('/aluno');
            }
            else {
                // Se cair aqui, vamos mostrar o que o C# mandou no erro
                setErro(`Perfil não reconhecido. O servidor enviou: ${rolesEnviadas.join(', ') || 'NADA'}`);
            }

        } catch (err: any) {
            console.error("ERRO NO LOGIN:", err);
            setErro(err.response?.data?.message || 'Dados incorretos ou erro de servidor.');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-950 p-4">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-10 shadow-2xl">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                        <LogIn className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">SIGA <span className="text-blue-400">EDU</span></h1>
                    <p className="text-blue-200/50 text-[10px] uppercase font-bold tracking-widest mt-2">Gestão Escolar Inteligente</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {erro && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-xs p-4 rounded-2xl flex items-center gap-3 animate-pulse">
                            <ShieldAlert className="w-5 h-5 shrink-0" />
                            <span>{erro}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        <input required type="email" placeholder="E-mail" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={email} onChange={e => setEmail(e.target.value)} />
                        <input required type="password" placeholder="Palavra-passe" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>

                    <button disabled={carregando} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center space-x-2">
                        {carregando ? <Loader2 className="animate-spin" /> : <span>Entrar no Portal</span>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;