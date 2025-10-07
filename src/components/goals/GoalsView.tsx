import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { PT_BR } from '../../constants/pt-br';
import { Database } from '../../lib/database.types';
import { Target, TrendingUp, AlertCircle, CheckCircle, Plus } from 'lucide-react';

type Meta = Database['public']['Tables']['metas']['Row'];

export function GoalsView() {
  const [goals, setGoals] = useState<Meta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('metas')
        .select('*')
        .order('data_alvo', { ascending: true });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'No Prazo':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Em Risco':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Atrasada':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Concluída':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Cancelada':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'No Prazo':
        return <CheckCircle className="w-4 h-4" />;
      case 'Em Risco':
        return <AlertCircle className="w-4 h-4" />;
      case 'Atrasada':
        return <AlertCircle className="w-4 h-4" />;
      case 'Concluída':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Sem data';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const activeGoals = goals.filter(g => g.status !== 'Concluída' && g.status !== 'Cancelada');
  const completedGoals = goals.filter(g => g.status === 'Concluída');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">{PT_BR.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">{PT_BR.goals.title}</h2>
          <p className="text-sm text-gray-400 mt-1">
            {activeGoals.length} metas ativas • {completedGoals.length} concluídas
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {PT_BR.goals.addGoal}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-orange-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{PT_BR.goals.activeGoals}</p>
              <p className="text-2xl font-bold text-gray-100">{activeGoals.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{PT_BR.goals.completedGoals}</p>
              <p className="text-2xl font-bold text-gray-100">{completedGoals.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Em Risco</p>
              <p className="text-2xl font-bold text-gray-100">
                {goals.filter(g => g.status === 'Em Risco').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">{PT_BR.goals.activeGoals}</h3>
        <div className="space-y-4">
          {activeGoals.map((goal) => (
            <div key={goal.id} className="card hover:border-orange-primary/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-100">{goal.titulo}</h3>
                    <span className={`px-3 py-1 text-xs rounded border flex items-center gap-1 ${getStatusColor(goal.status)}`}>
                      {getStatusIcon(goal.status)}
                      {goal.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="px-2 py-1 bg-dark-elevated rounded">{goal.tipo_meta}</span>
                    {goal.membro_nome && (
                      <span>{goal.membro_nome}</span>
                    )}
                    <span>Alvo: {formatDate(goal.data_alvo)}</span>
                  </div>
                </div>
              </div>

              {goal.descricao && (
                <p className="text-sm text-gray-400 mb-4">{goal.descricao}</p>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{PT_BR.goals.progress}</span>
                  <span className="text-orange-primary font-medium">{goal.progresso || 0}%</span>
                </div>
                <div className="w-full bg-dark-elevated rounded-full h-2">
                  <div
                    className="bg-orange-primary rounded-full h-2 transition-all duration-300"
                    style={{ width: `${goal.progresso || 0}%` }}
                  ></div>
                </div>
              </div>

              {(goal.obstaculos || goal.apoio_necessario) && (
                <div className="pt-4 border-t border-dark-border mt-4 space-y-2">
                  {goal.obstaculos && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-1">{PT_BR.goals.obstacles}:</p>
                      <p className="text-sm text-gray-300">{goal.obstaculos}</p>
                    </div>
                  )}
                  {goal.apoio_necessario && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-1">{PT_BR.goals.supportNeeded}:</p>
                      <p className="text-sm text-gray-300">{goal.apoio_necessario}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {goals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">{PT_BR.common.noData}</p>
        </div>
      )}
    </div>
  );
}
