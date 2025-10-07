import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { PT_BR } from '../../constants/pt-br';
import { Database } from '../../lib/database.types';
import { Users, CheckCircle, Clock, Plus } from 'lucide-react';

type Dupla = Database['public']['Tables']['duplas']['Row'];
type Visita = Database['public']['Tables']['visitas']['Row'];

export function MinisteringView() {
  const [companionships, setCompanionships] = useState<Dupla[]>([]);
  const [visits, setVisits] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const [completionRate, setCompletionRate] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [duplasRes, visitasRes, familiasRes] = await Promise.all([
        supabase.from('duplas').select('*').eq('ativo', true).order('nome_dupla'),
        supabase.from('visitas').select('*').gte('data_visita', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        supabase.from('familias').select('*', { count: 'exact' }),
      ]);

      if (duplasRes.data) setCompanionships(duplasRes.data);
      if (visitasRes.data) setVisits(visitasRes.data);

      const totalFamilias = familiasRes.count || 0;
      const visitasRealizadas = visitasRes.data?.filter(v => v.realizada).length || 0;
      const rate = totalFamilias > 0 ? Math.round((visitasRealizadas / totalFamilias) * 100) : 0;
      setCompletionRate(rate);
    } catch (error) {
      console.error('Erro ao carregar dados de ministração:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="text-2xl font-bold text-gray-100">{PT_BR.ministering.title}</h2>
          <p className="text-sm text-gray-400 mt-1">
            {companionships.length} duplas ativas
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {PT_BR.ministering.addCompanionship}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{PT_BR.ministering.companionships}</p>
              <p className="text-2xl font-bold text-gray-100">{companionships.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{PT_BR.ministering.completionRate}</p>
              <p className="text-2xl font-bold text-gray-100">{completionRate}%</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{PT_BR.ministering.overdueVisits}</p>
              <p className="text-2xl font-bold text-gray-100">
                {visits.filter(v => !v.realizada).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {companionships.map((companionship) => (
          <div key={companionship.id} className="card hover:border-orange-primary/30 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-100 mb-1">{companionship.nome_dupla}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>
                    {companionship.companheiro_1_nome}
                    {companionship.companheiro_2_nome && ` & ${companionship.companheiro_2_nome}`}
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 text-xs bg-green-500/20 text-green-400 border border-green-500/30 rounded">
                {PT_BR.ministering.active}
              </span>
            </div>

            <div className="pt-3 border-t border-dark-border">
              <p className="text-sm text-gray-400 mb-2">
                {PT_BR.ministering.assignedFamilies}:
              </p>
              <p className="text-sm text-gray-300">
                {companionship.familias_atribuidas?.length || 0} famílias
              </p>
            </div>

            <div className="mt-4">
              <button className="btn-secondary w-full text-sm">
                {PT_BR.ministering.recordVisit}
              </button>
            </div>
          </div>
        ))}
      </div>

      {companionships.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">{PT_BR.common.noData}</p>
        </div>
      )}
    </div>
  );
}
