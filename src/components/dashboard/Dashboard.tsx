import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { PT_BR } from '../../constants/pt-br';
import {
  Users,
  Home,
  UserCheck,
  AlertCircle,
  Calendar,
  TrendingUp,
  Target
} from 'lucide-react';

interface DashboardStats {
  totalMembers: number;
  totalFamilies: number;
  activeCompanionships: number;
  ministeringCompletion: number;
  needsAttention: number;
  newMembers: number;
  lessActive: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    totalFamilies: 0,
    activeCompanionships: 0,
    ministeringCompletion: 0,
    needsAttention: 0,
    newMembers: 0,
    lessActive: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [membrosRes, familiasRes, duplasRes, visitasRes] = await Promise.all([
        supabase.from('membros').select('*', { count: 'exact' }),
        supabase.from('familias').select('*', { count: 'exact' }),
        supabase.from('duplas').select('*', { count: 'exact' }).eq('ativo', true),
        supabase.from('visitas').select('*').gte('data_visita', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
      ]);

      const newMembersCount = membrosRes.data?.filter(m => m.status_atividade === 'Novo').length || 0;
      const lessActiveCount = membrosRes.data?.filter(m => m.status_atividade === 'Menos Ativo').length || 0;
      const needsAttentionCount = membrosRes.data?.filter(m =>
        m.necessidades_especiais || m.status_atividade === 'Menos Ativo'
      ).length || 0;

      const totalFamilias = familiasRes.count || 0;
      const visitasRealizadas = visitasRes.data?.filter(v => v.realizada).length || 0;
      const completion = totalFamilias > 0 ? Math.round((visitasRealizadas / totalFamilias) * 100) : 0;

      setStats({
        totalMembers: membrosRes.count || 0,
        totalFamilies: totalFamilias,
        activeCompanionships: duplasRes.count || 0,
        ministeringCompletion: completion,
        needsAttention: needsAttentionCount,
        newMembers: newMembersCount,
        lessActive: lessActiveCount,
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: PT_BR.dashboard.totalMembers,
      value: stats.totalMembers,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: PT_BR.dashboard.totalFamilies,
      value: stats.totalFamilies,
      icon: Home,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      title: PT_BR.dashboard.activeCompanionships,
      value: stats.activeCompanionships,
      icon: UserCheck,
      color: 'text-orange-primary',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: PT_BR.dashboard.ministeringCompletion,
      value: `${stats.ministeringCompletion}%`,
      icon: Target,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ];

  const alertCards = [
    {
      title: PT_BR.dashboard.needsAttention,
      value: stats.needsAttention,
      icon: AlertCircle,
      color: 'text-red-400',
    },
    {
      title: PT_BR.dashboard.newMembers,
      value: stats.newMembers,
      icon: TrendingUp,
      color: 'text-green-400',
    },
    {
      title: PT_BR.dashboard.lessActive,
      value: stats.lessActive,
      icon: AlertCircle,
      color: 'text-yellow-400',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">{PT_BR.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-100">{card.value}</p>
                </div>
                <div className={`w-14 h-14 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {alertCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="card hover:border-orange-primary/30 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <Icon className={`w-8 h-8 ${card.color}`} />
                <div>
                  <p className="text-sm text-gray-400">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-100">{card.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-orange-primary" />
            <h3 className="text-lg font-semibold text-gray-100">{PT_BR.dashboard.upcomingActivities}</h3>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-400">{PT_BR.common.noData}</p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-orange-primary" />
            <h3 className="text-lg font-semibold text-gray-100">{PT_BR.dashboard.recentGoals}</h3>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-400">{PT_BR.common.noData}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
