import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { PT_BR } from '../../constants/pt-br';
import { Database } from '../../lib/database.types';
import { Calendar, Clock, MapPin, Users, Plus } from 'lucide-react';

type Reuniao = Database['public']['Tables']['reunioes']['Row'];

export function MeetingsView() {
  const [meetings, setMeetings] = useState<Reuniao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from('reunioes')
        .select('*')
        .order('data', { ascending: false });

      if (error) throw error;
      setMeetings(data || []);
    } catch (error) {
      console.error('Erro ao carregar reuniões:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMeetingTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'Presidência':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Quórum':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Conselho':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Atividade':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
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
          <h2 className="text-2xl font-bold text-gray-100">{PT_BR.meetings.title}</h2>
          <p className="text-sm text-gray-400 mt-1">
            {meetings.length} {meetings.length === 1 ? 'reunião' : 'reuniões'} registradas
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {PT_BR.meetings.addMeeting}
        </button>
      </div>

      <div className="space-y-4">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="card hover:border-orange-primary/30 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-100 text-lg">{meeting.titulo}</h3>
                  <span className={`px-3 py-1 text-xs rounded border ${getMeetingTypeColor(meeting.tipo_reuniao)}`}>
                    {meeting.tipo_reuniao}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(meeting.data)}</span>
                  </div>
                  {meeting.horario && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{meeting.horario}</span>
                    </div>
                  )}
                  {meeting.local && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{meeting.local}</span>
                    </div>
                  )}
                  {meeting.participantes && meeting.participantes.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{meeting.participantes.length} participantes</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {meeting.pauta && meeting.pauta.length > 0 && (
              <div className="pt-3 border-t border-dark-border">
                <p className="text-sm font-medium text-gray-300 mb-2">Pauta:</p>
                <ul className="space-y-1">
                  {meeting.pauta.slice(0, 3).map((item, index) => (
                    <li key={index} className="text-sm text-gray-400 flex items-start gap-2">
                      <span className="text-orange-primary mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                  {meeting.pauta.length > 3 && (
                    <li className="text-sm text-orange-primary">
                      +{meeting.pauta.length - 3} mais...
                    </li>
                  )}
                </ul>
              </div>
            )}

            {meeting.decisoes && meeting.decisoes.length > 0 && (
              <div className="pt-3 border-t border-dark-border mt-3">
                <p className="text-sm font-medium text-gray-300 mb-2">Decisões:</p>
                <div className="flex flex-wrap gap-2">
                  {meeting.decisoes.map((decisao, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                      {decisao}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4">
              <button className="btn-secondary text-sm">
                {PT_BR.common.viewDetails}
              </button>
            </div>
          </div>
        ))}
      </div>

      {meetings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">{PT_BR.common.noData}</p>
        </div>
      )}
    </div>
  );
}
