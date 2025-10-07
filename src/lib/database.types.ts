export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      familias: {
        Row: {
          id: string
          nome_familia: string
          endereco_completo: string | null
          rua: string | null
          numero: string | null
          bairro: string | null
          cep: string | null
          telefone_principal: string | null
          email_principal: string | null
          dupla_ministrante_id: string | null
          observacoes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome_familia: string
          endereco_completo?: string | null
          rua?: string | null
          numero?: string | null
          bairro?: string | null
          cep?: string | null
          telefone_principal?: string | null
          email_principal?: string | null
          dupla_ministrante_id?: string | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome_familia?: string
          endereco_completo?: string | null
          rua?: string | null
          numero?: string | null
          bairro?: string | null
          cep?: string | null
          telefone_principal?: string | null
          email_principal?: string | null
          dupla_ministrante_id?: string | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      membros: {
        Row: {
          id: string
          nome_completo: string
          foto_perfil: string | null
          sexo: 'Masculino' | 'Feminino' | null
          idade: number | null
          data_nascimento: string | null
          telefone: string | null
          email: string | null
          endereco_completo: string | null
          rua: string | null
          numero: string | null
          bairro: string | null
          cep: string | null
          familia_id: string | null
          organizacao: string | null
          status_atividade: 'Ativo' | 'Menos Ativo' | 'Inativo' | 'Novo' | null
          detentor_sacerdocio: boolean | null
          oficio_sacerdocio: 'Diácono' | 'Mestre' | 'Sacerdote' | 'Élder' | 'Sumo Sacerdote' | 'Nenhum' | null
          recommend_templo: boolean | null
          parentesco: 'Pai' | 'Mãe' | 'Filho' | 'Filha' | 'Cônjuge' | 'Outro' | null
          pai_id: string | null
          mae_id: string | null
          conjuge_id: string | null
          observacoes: string | null
          necessidades_especiais: string | null
          impressoes_espirituais: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome_completo: string
          foto_perfil?: string | null
          sexo?: 'Masculino' | 'Feminino' | null
          idade?: number | null
          data_nascimento?: string | null
          telefone?: string | null
          email?: string | null
          endereco_completo?: string | null
          rua?: string | null
          numero?: string | null
          bairro?: string | null
          cep?: string | null
          familia_id?: string | null
          organizacao?: string | null
          status_atividade?: 'Ativo' | 'Menos Ativo' | 'Inativo' | 'Novo' | null
          detentor_sacerdocio?: boolean | null
          oficio_sacerdocio?: 'Diácono' | 'Mestre' | 'Sacerdote' | 'Élder' | 'Sumo Sacerdote' | 'Nenhum' | null
          recommend_templo?: boolean | null
          parentesco?: 'Pai' | 'Mãe' | 'Filho' | 'Filha' | 'Cônjuge' | 'Outro' | null
          pai_id?: string | null
          mae_id?: string | null
          conjuge_id?: string | null
          observacoes?: string | null
          necessidades_especiais?: string | null
          impressoes_espirituais?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome_completo?: string
          foto_perfil?: string | null
          sexo?: 'Masculino' | 'Feminino' | null
          idade?: number | null
          data_nascimento?: string | null
          telefone?: string | null
          email?: string | null
          endereco_completo?: string | null
          rua?: string | null
          numero?: string | null
          bairro?: string | null
          cep?: string | null
          familia_id?: string | null
          organizacao?: string | null
          status_atividade?: 'Ativo' | 'Menos Ativo' | 'Inativo' | 'Novo' | null
          detentor_sacerdocio?: boolean | null
          oficio_sacerdocio?: 'Diácono' | 'Mestre' | 'Sacerdote' | 'Élder' | 'Sumo Sacerdote' | 'Nenhum' | null
          recommend_templo?: boolean | null
          parentesco?: 'Pai' | 'Mãe' | 'Filho' | 'Filha' | 'Cônjuge' | 'Outro' | null
          pai_id?: string | null
          mae_id?: string | null
          conjuge_id?: string | null
          observacoes?: string | null
          necessidades_especiais?: string | null
          impressoes_espirituais?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      duplas: {
        Row: {
          id: string
          nome_dupla: string
          companheiro_1_id: string | null
          companheiro_1_nome: string | null
          companheiro_2_id: string | null
          companheiro_2_nome: string | null
          familias_atribuidas: string[] | null
          ativo: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome_dupla: string
          companheiro_1_id?: string | null
          companheiro_1_nome?: string | null
          companheiro_2_id?: string | null
          companheiro_2_nome?: string | null
          familias_atribuidas?: string[] | null
          ativo?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome_dupla?: string
          companheiro_1_id?: string | null
          companheiro_1_nome?: string | null
          companheiro_2_id?: string | null
          companheiro_2_nome?: string | null
          familias_atribuidas?: string[] | null
          ativo?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      visitas: {
        Row: {
          id: string
          dupla_id: string | null
          dupla_nome: string | null
          familia_id: string | null
          familia_nome: string | null
          data_visita: string | null
          mes_referencia: string | null
          tipo_contato: 'Presencial' | 'Telefone' | 'Mensagem' | 'Virtual' | 'Outro' | null
          realizada: boolean | null
          necessidades_identificadas: string | null
          observacoes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          dupla_id?: string | null
          dupla_nome?: string | null
          familia_id?: string | null
          familia_nome?: string | null
          data_visita?: string | null
          mes_referencia?: string | null
          tipo_contato?: 'Presencial' | 'Telefone' | 'Mensagem' | 'Virtual' | 'Outro' | null
          realizada?: boolean | null
          necessidades_identificadas?: string | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          dupla_id?: string | null
          dupla_nome?: string | null
          familia_id?: string | null
          familia_nome?: string | null
          data_visita?: string | null
          mes_referencia?: string | null
          tipo_contato?: 'Presencial' | 'Telefone' | 'Mensagem' | 'Virtual' | 'Outro' | null
          realizada?: boolean | null
          necessidades_identificadas?: string | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reunioes: {
        Row: {
          id: string
          titulo: string
          tipo_reuniao: 'Presidência' | 'Quórum' | 'Conselho' | 'Atividade' | 'Outro'
          data: string
          horario: string | null
          local: string | null
          participantes: string[] | null
          pauta: string[] | null
          discussoes: string | null
          decisoes: string[] | null
          acoes: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo: string
          tipo_reuniao: 'Presidência' | 'Quórum' | 'Conselho' | 'Atividade' | 'Outro'
          data: string
          horario?: string | null
          local?: string | null
          participantes?: string[] | null
          pauta?: string[] | null
          discussoes?: string | null
          decisoes?: string[] | null
          acoes?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          tipo_reuniao?: 'Presidência' | 'Quórum' | 'Conselho' | 'Atividade' | 'Outro'
          data?: string
          horario?: string | null
          local?: string | null
          participantes?: string[] | null
          pauta?: string[] | null
          discussoes?: string | null
          decisoes?: string[] | null
          acoes?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      metas: {
        Row: {
          id: string
          titulo: string
          tipo_meta: 'Individual' | 'Quórum' | 'Sacerdócio' | 'Reativação' | 'Templo' | 'Missionário' | 'Outro'
          membro_id: string | null
          membro_nome: string | null
          descricao: string | null
          data_inicio: string | null
          data_alvo: string | null
          status: 'No Prazo' | 'Em Risco' | 'Atrasada' | 'Concluída' | 'Cancelada' | null
          progresso: number | null
          marcos: Json | null
          obstaculos: string | null
          apoio_necessario: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo: string
          tipo_meta: 'Individual' | 'Quórum' | 'Sacerdócio' | 'Reativação' | 'Templo' | 'Missionário' | 'Outro'
          membro_id?: string | null
          membro_nome?: string | null
          descricao?: string | null
          data_inicio?: string | null
          data_alvo?: string | null
          status?: 'No Prazo' | 'Em Risco' | 'Atrasada' | 'Concluída' | 'Cancelada' | null
          progresso?: number | null
          marcos?: Json | null
          obstaculos?: string | null
          apoio_necessario?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          tipo_meta?: 'Individual' | 'Quórum' | 'Sacerdócio' | 'Reativação' | 'Templo' | 'Missionário' | 'Outro'
          membro_id?: string | null
          membro_nome?: string | null
          descricao?: string | null
          data_inicio?: string | null
          data_alvo?: string | null
          status?: 'No Prazo' | 'Em Risco' | 'Atrasada' | 'Concluída' | 'Cancelada' | null
          progresso?: number | null
          marcos?: Json | null
          obstaculos?: string | null
          apoio_necessario?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      atividades: {
        Row: {
          id: string
          nome: string
          tipo_atividade: 'Serviço' | 'Social' | 'Espiritual' | 'Esportiva' | 'Cultural' | 'Outro'
          data: string
          horario: string | null
          local: string | null
          descricao: string | null
          orcamento_previsto: number | null
          orcamento_real: number | null
          responsavel: string | null
          participantes: string[] | null
          total_participantes: number | null
          avaliacao: string | null
          feedback: string | null
          status: 'Planejada' | 'Em Andamento' | 'Concluída' | 'Cancelada' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          tipo_atividade: 'Serviço' | 'Social' | 'Espiritual' | 'Esportiva' | 'Cultural' | 'Outro'
          data: string
          horario?: string | null
          local?: string | null
          descricao?: string | null
          orcamento_previsto?: number | null
          orcamento_real?: number | null
          responsavel?: string | null
          participantes?: string[] | null
          total_participantes?: number | null
          avaliacao?: string | null
          feedback?: string | null
          status?: 'Planejada' | 'Em Andamento' | 'Concluída' | 'Cancelada' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          tipo_atividade?: 'Serviço' | 'Social' | 'Espiritual' | 'Esportiva' | 'Cultural' | 'Outro'
          data?: string
          horario?: string | null
          local?: string | null
          descricao?: string | null
          orcamento_previsto?: number | null
          orcamento_real?: number | null
          responsavel?: string | null
          participantes?: string[] | null
          total_participantes?: number | null
          avaliacao?: string | null
          feedback?: string | null
          status?: 'Planejada' | 'Em Andamento' | 'Concluída' | 'Cancelada' | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
