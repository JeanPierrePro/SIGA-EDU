// 1. Importa o Axios no topo
import axios from 'axios';

// 2. Dentro do componente, cria a função de salvar:
const salvarNoBanco = async () => {
    try {
        const token = localStorage.getItem('token');
        
        // Transformamos as chaves "2026-04-12T14:00" em objetos Date reais
        const dadosParaEnviar = disponiveis.map(d => new Date(d));

        const response = await axios.post('http://localhost:5022/api/Admin/salvar-disponibilidade', 
            dadosParaEnviar, 
            { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("Sucesso: " + response.data.message);
    } catch (error) {
        console.error(error);
        alert("Erro ao guardar agenda.");
    }
};

// 3. No teu JSX, no botão "GUARDAR", adiciona o onClick:
<button 
    onClick={salvarNoBanco}
    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl transition-all active:scale-95"
>
    <Save className="w-5 h-5" /> 
    <span>Publicar Agenda</span>
</button>