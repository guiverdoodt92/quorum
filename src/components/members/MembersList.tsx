import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { PT_BR } from '../../constants/pt-br';
import { Database } from '../../lib/database.types';
import { Search, Filter, Plus, Phone, Mail, MapPin, CreditCard as Edit, User } from 'lucide-react';

type Membro = Database['public']['Tables']['membros']['Row'];

interface FiltersState {
  search: string;
  bairro: string;
  status_atividade: string;
  sexo: string;
}

export function MembersList() {
  const [members, setMembers] = useState<Membro[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Membro[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FiltersState>({
    search: '',
    bairro: '',
    status_atividade: '',
    sexo: '',
  });
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, members]);

  const loadMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('membros')
        .select('*')
        .order('nome_completo');

      if (error) throw error;

      setMembers(data || []);

      const uniqueBairros = [...new Set(data?.map(m => m.bairro).filter(Boolean) as string[])];
      setNeighborhoods(uniqueBairros.sort());
    } catch (error) {
      console.error('Erro ao carregar membros:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...members];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(m =>
        m.nome_completo.toLowerCase().includes(searchLower) ||
        m.email?.toLowerCase().includes(searchLower) ||
        m.telefone?.includes(filters.search)
      );
    }

    if (filters.bairro) {
      filtered = filtered.filter(m => m.bairro === filters.bairro);
    }

    if (filters.status_atividade) {
      filtered = filtered.filter(m => m.status_atividade === filters.status_atividade);
    }

    if (filters.sexo) {
      filtered = filtered.filter(m => m.sexo === filters.sexo);
    }

    setFilteredMembers(filtered);
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Menos Ativo':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Inativo':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Novo':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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
          <h2 className="text-2xl font-bold text-gray-100">{PT_BR.members.title}</h2>
          <p className="text-sm text-gray-400 mt-1">
            {filteredMembers.length} {filteredMembers.length === 1 ? 'membro' : 'membros'}
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {PT_BR.members.addMember}
        </button>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {PT_BR.common.search}
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder={PT_BR.members.searchMembers}
                className="input-field w-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {PT_BR.members.neighborhood}
            </label>
            <select
              value={filters.bairro}
              onChange={(e) => setFilters({ ...filters, bairro: e.target.value })}
              className="input-field w-full"
            >
              <option value="">Todos</option>
              {neighborhoods.map(bairro => (
                <option key={bairro} value={bairro}>{bairro}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {PT_BR.members.activityStatus}
            </label>
            <select
              value={filters.status_atividade}
              onChange={(e) => setFilters({ ...filters, status_atividade: e.target.value })}
              className="input-field w-full"
            >
              <option value="">Todos</option>
              <option value="Ativo">{PT_BR.members.active}</option>
              <option value="Menos Ativo">{PT_BR.members.lessActive}</option>
              <option value="Inativo">{PT_BR.members.inactive}</option>
              <option value="Novo">{PT_BR.members.new}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {PT_BR.members.gender}
            </label>
            <select
              value={filters.sexo}
              onChange={(e) => setFilters({ ...filters, sexo: e.target.value })}
              className="input-field w-full"
            >
              <option value="">Todos</option>
              <option value="Masculino">{PT_BR.members.male}</option>
              <option value="Feminino">{PT_BR.members.female}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <div key={member.id} className="card hover:border-orange-primary/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-dark-elevated rounded-full flex items-center justify-center flex-shrink-0">
                {member.foto_perfil ? (
                  <img src={member.foto_perfil} alt={member.nome_completo} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-gray-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-100 truncate">{member.nome_completo}</h3>
                  <button className="text-gray-400 hover:text-orange-primary transition-colors p-1">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>

                {member.status_atividade && (
                  <span className={`inline-block px-2 py-1 text-xs rounded border ${getStatusColor(member.status_atividade)} mb-2`}>
                    {member.status_atividade}
                  </span>
                )}

                <div className="space-y-1 text-sm">
                  {member.idade && (
                    <p className="text-gray-400">{member.idade} anos</p>
                  )}
                  {member.telefone && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Phone className="w-4 h-4" />
                      <span className="truncate">{member.telefone}</span>
                    </div>
                  )}
                  {member.email && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  )}
                  {member.bairro && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{member.bairro}</span>
                    </div>
                  )}
                </div>

                {member.oficio_sacerdocio && member.oficio_sacerdocio !== 'Nenhum' && (
                  <div className="mt-2 pt-2 border-t border-dark-border">
                    <p className="text-xs text-orange-primary font-medium">{member.oficio_sacerdocio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">{PT_BR.common.noData}</p>
        </div>
      )}
    </div>
  );
}
