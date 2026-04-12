import React from 'react';
import { Users, GraduationCap, BookOpen, BarChart3 } from 'lucide-react';

const DashboardResumo: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 transition hover:shadow-md">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Alunos</p>
                        <h3 className="text-2xl font-bold text-gray-800">24</h3>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 transition hover:shadow-md">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Explicadores</p>
                        <h3 className="text-2xl font-bold text-gray-800">6</h3>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 transition hover:shadow-md">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Matérias Ativas</p>
                        <h3 className="text-2xl font-bold text-gray-800">12</h3>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center">
                <BarChart3 className="w-12 h-12 text-gray-200 mb-3" />
                <h3 className="text-gray-400 font-medium">Os gráficos de desempenho e faturação aparecerão aqui</h3>
            </div>
        </div>
    );
};

export default DashboardResumo;