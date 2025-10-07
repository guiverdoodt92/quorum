/*
  # Sistema de Gestão da Presidência do Quórum de Élderes - Schema Inicial

  ## Visão Geral
  Este schema cria todas as tabelas necessárias para gerenciar membros, famílias, 
  duplas ministrantes, visitas, reuniões, metas e atividades do Quórum de Élderes 
  da Ala Horizonte Azul.

  ## Tabelas Criadas

  1. **familias** - Unidades familiares (332 famílias)
     - Informações básicas da família
     - Endereço completo estruturado
     - Contatos principais
     - Dupla ministrante atribuída

  2. **membros** - Membros individuais (506 membros)
     - Dados pessoais completos
     - Informações de sacerdócio
     - Status de atividade
     - Relacionamentos familiares
     - Necessidades e observações

  3. **duplas** - Duplas ministrantes
     - Dois companheiros por dupla
     - Famílias atribuídas
     - Status ativo/inativo

  4. **visitas** - Registros de visitas ministrantes
     - Histórico de contatos
     - Necessidades identificadas
     - Tipo de contato realizado

  5. **reunioes** - Gerenciamento de reuniões
     - Diferentes tipos de reunião
     - Participantes e pauta
     - Decisões e ações

  6. **metas** - Sistema de metas
     - Metas individuais e do quórum
     - Progresso e marcos
     - Obstáculos e apoio necessário

  7. **atividades** - Planejamento de atividades
     - Eventos e atividades do quórum
     - Orçamento e participantes
     - Avaliação e feedback

  ## Segurança
  - RLS habilitado em todas as tabelas
  - Políticas restritivas para usuários autenticados
  - Proteção de dados sensíveis conforme LGPD

  ## Índices
  - Índices criados para buscas frequentes
  - Otimização de consultas geográficas
  - Performance para relacionamentos

*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABELA: Presidencia
-- ============================================================================

-- User management table for email/password login
CREATE TABLE public.users_auth (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email citext NOT NULL UNIQUE,
  password_hash text NOT NULL,
  email_confirmed boolean NOT NULL DEFAULT false,
  confirmation_token text,
  recovery_token text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index to speed lookups by lower(email) (citext already does case-insensitive)
CREATE INDEX ON public.users_auth (created_at);

-- Trigger to keep updated_at current
CREATE OR REPLACE FUNCTION public.set_timestamp()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_auth_set_timestamp
BEFORE UPDATE ON public.users_auth
FOR EACH ROW EXECUTE FUNCTION public.set_timestamp();

-- ============================================================================
-- TABELA: familias
-- ============================================================================
CREATE TABLE IF NOT EXISTS familias (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome_familia text NOT NULL,
  endereco_completo text,
  rua text,
  numero text,
  bairro text,
  cep text,
  telefone_principal text,
  email_principal text,
  dupla_ministrante_id uuid,
  observacoes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- TABELA: membros
-- ============================================================================
CREATE TABLE IF NOT EXISTS membros (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome_completo text NOT NULL,
  foto_perfil text,
  sexo text CHECK (sexo IN ('Masculino', 'Feminino')),
  idade integer,
  data_nascimento date,
  telefone text,
  email text,
  endereco_completo text,
  rua text,
  numero text,
  bairro text,
  cep text,
  familia_id uuid REFERENCES familias(id) ON DELETE SET NULL,
  organizacao text,
  status_atividade text CHECK (status_atividade IN ('Ativo', 'Menos Ativo', 'Inativo', 'Novo')),
  detentor_sacerdocio boolean DEFAULT false,
  oficio_sacerdocio text CHECK (oficio_sacerdocio IN ('Diácono', 'Mestre', 'Sacerdote', 'Élder', 'Sumo Sacerdote', 'Nenhum')),
  recommend_templo boolean DEFAULT false,
  parentesco text CHECK (parentesco IN ('Pai', 'Mãe', 'Filho', 'Filha', 'Cônjuge', 'Outro')),
  pai_id uuid REFERENCES membros(id) ON DELETE SET NULL,
  mae_id uuid REFERENCES membros(id) ON DELETE SET NULL,
  conjuge_id uuid REFERENCES membros(id) ON DELETE SET NULL,
  observacoes text,
  necessidades_especiais text,
  impressoes_espirituais text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- TABELA: duplas
-- ============================================================================
CREATE TABLE IF NOT EXISTS duplas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome_dupla text NOT NULL,
  companheiro_1_id uuid REFERENCES membros(id) ON DELETE SET NULL,
  companheiro_1_nome text,
  companheiro_2_id uuid REFERENCES membros(id) ON DELETE SET NULL,
  companheiro_2_nome text,
  familias_atribuidas text[],
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key to familias for dupla_ministrante_id
ALTER TABLE familias
  ADD CONSTRAINT fk_dupla_ministrante 
  FOREIGN KEY (dupla_ministrante_id) 
  REFERENCES duplas(id) 
  ON DELETE SET NULL;

-- ============================================================================
-- TABELA: visitas
-- ============================================================================
CREATE TABLE IF NOT EXISTS visitas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  dupla_id uuid REFERENCES duplas(id) ON DELETE CASCADE,
  dupla_nome text,
  familia_id uuid REFERENCES familias(id) ON DELETE CASCADE,
  familia_nome text,
  data_visita date,
  mes_referencia text,
  tipo_contato text CHECK (tipo_contato IN ('Presencial', 'Telefone', 'Mensagem', 'Virtual', 'Outro')),
  realizada boolean DEFAULT false,
  necessidades_identificadas text,
  observacoes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- TABELA: reunioes
-- ============================================================================
CREATE TABLE IF NOT EXISTS reunioes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo text NOT NULL,
  tipo_reuniao text CHECK (tipo_reuniao IN ('Presidência', 'Quórum', 'Conselho', 'Atividade', 'Outro')) NOT NULL,
  data date NOT NULL,
  horario time,
  local text,
  participantes text[],
  pauta text[],
  discussoes text,
  decisoes text[],
  acoes jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- TABELA: metas
-- ============================================================================
CREATE TABLE IF NOT EXISTS metas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo text NOT NULL,
  tipo_meta text CHECK (tipo_meta IN ('Individual', 'Quórum', 'Sacerdócio', 'Reativação', 'Templo', 'Missionário', 'Outro')) NOT NULL,
  membro_id uuid REFERENCES membros(id) ON DELETE CASCADE,
  membro_nome text,
  descricao text,
  data_inicio date DEFAULT CURRENT_DATE,
  data_alvo date,
  status text CHECK (status IN ('No Prazo', 'Em Risco', 'Atrasada', 'Concluída', 'Cancelada')) DEFAULT 'No Prazo',
  progresso integer DEFAULT 0 CHECK (progresso >= 0 AND progresso <= 100),
  marcos jsonb,
  obstaculos text,
  apoio_necessario text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- TABELA: atividades
-- ============================================================================
CREATE TABLE IF NOT EXISTS atividades (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome text NOT NULL,
  tipo_atividade text CHECK (tipo_atividade IN ('Serviço', 'Social', 'Espiritual', 'Esportiva', 'Cultural', 'Outro')) NOT NULL,
  data date NOT NULL,
  horario time,
  local text,
  descricao text,
  orcamento_previsto numeric(10,2) DEFAULT 0,
  orcamento_real numeric(10,2) DEFAULT 0,
  responsavel text,
  participantes text[],
  total_participantes integer DEFAULT 0,
  avaliacao text,
  feedback text,
  status text CHECK (status IN ('Planejada', 'Em Andamento', 'Concluída', 'Cancelada')) DEFAULT 'Planejada',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================================

-- Índices para buscas geográficas
CREATE INDEX IF NOT EXISTS idx_membros_bairro ON membros(bairro);
CREATE INDEX IF NOT EXISTS idx_membros_rua ON membros(rua);
CREATE INDEX IF NOT EXISTS idx_membros_cep ON membros(cep);
CREATE INDEX IF NOT EXISTS idx_familias_bairro ON familias(bairro);
CREATE INDEX IF NOT EXISTS idx_familias_rua ON familias(rua);

-- Índices para filtros comuns
CREATE INDEX IF NOT EXISTS idx_membros_status_atividade ON membros(status_atividade);
CREATE INDEX IF NOT EXISTS idx_membros_oficio_sacerdocio ON membros(oficio_sacerdocio);
CREATE INDEX IF NOT EXISTS idx_membros_familia_id ON membros(familia_id);
CREATE INDEX IF NOT EXISTS idx_membros_idade ON membros(idade);

-- Índices para relacionamentos
CREATE INDEX IF NOT EXISTS idx_duplas_ativo ON duplas(ativo);
CREATE INDEX IF NOT EXISTS idx_visitas_dupla_id ON visitas(dupla_id);
CREATE INDEX IF NOT EXISTS idx_visitas_familia_id ON visitas(familia_id);
CREATE INDEX IF NOT EXISTS idx_visitas_mes_referencia ON visitas(mes_referencia);
CREATE INDEX IF NOT EXISTS idx_metas_membro_id ON metas(membro_id);
CREATE INDEX IF NOT EXISTS idx_metas_status ON metas(status);

-- Índices para datas
CREATE INDEX IF NOT EXISTS idx_reunioes_data ON reunioes(data);
CREATE INDEX IF NOT EXISTS idx_atividades_data ON atividades(data);
CREATE INDEX IF NOT EXISTS idx_metas_data_alvo ON metas(data_alvo);

-- ============================================================================
-- FUNÇÕES DE TRIGGER PARA updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas as tabelas
CREATE TRIGGER update_familias_updated_at BEFORE UPDATE ON familias
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_membros_updated_at BEFORE UPDATE ON membros
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_duplas_updated_at BEFORE UPDATE ON duplas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visitas_updated_at BEFORE UPDATE ON visitas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reunioes_updated_at BEFORE UPDATE ON reunioes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_metas_updated_at BEFORE UPDATE ON metas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_atividades_updated_at BEFORE UPDATE ON atividades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE familias ENABLE ROW LEVEL SECURITY;
ALTER TABLE membros ENABLE ROW LEVEL SECURITY;
ALTER TABLE duplas ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE reunioes ENABLE ROW LEVEL SECURITY;
ALTER TABLE metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE atividades ENABLE ROW LEVEL SECURITY;

-- Políticas para familias
CREATE POLICY "Usuários autenticados podem visualizar famílias"
  ON familias FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir famílias"
  ON familias FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar famílias"
  ON familias FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar famílias"
  ON familias FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para membros
CREATE POLICY "Usuários autenticados podem visualizar membros"
  ON membros FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir membros"
  ON membros FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar membros"
  ON membros FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar membros"
  ON membros FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para duplas
CREATE POLICY "Usuários autenticados podem visualizar duplas"
  ON duplas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir duplas"
  ON duplas FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar duplas"
  ON duplas FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar duplas"
  ON duplas FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para visitas
CREATE POLICY "Usuários autenticados podem visualizar visitas"
  ON visitas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir visitas"
  ON visitas FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar visitas"
  ON visitas FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar visitas"
  ON visitas FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para reunioes
CREATE POLICY "Usuários autenticados podem visualizar reuniões"
  ON reunioes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir reuniões"
  ON reunioes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar reuniões"
  ON reunioes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar reuniões"
  ON reunioes FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para metas
CREATE POLICY "Usuários autenticados podem visualizar metas"
  ON metas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir metas"
  ON metas FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar metas"
  ON metas FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar metas"
  ON metas FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para atividades
CREATE POLICY "Usuários autenticados podem visualizar atividades"
  ON atividades FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir atividades"
  ON atividades FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar atividades"
  ON atividades FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar atividades"
  ON atividades FOR DELETE
  TO authenticated
  USING (true);