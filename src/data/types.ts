// Tipos de domínio. Quando houver banco real, estes tipos devem espelhar as tabelas.
export type FamiliaStatus = "Ativa" | "Em acompanhamento" | "Inativa";
export interface Familia {
  id: string;
  codigo: string;
  responsavel: string;
  bairro: string;
  telefone: string;
  status: FamiliaStatus;
  dataCadastro: string;
  observacoes: string;
}
export type Parentesco = "Responsável" | "Cônjuge" | "Filho(a)" | "Neto(a)" | "Avô/Avó" | "Outro";
export interface Pessoa {
  id: string;
  familiaId: string;
  nome: string;
  parentesco: Parentesco;
  anoNascimento: number;
}
export type DemandaCategoria = "Alimentação" | "Moradia" | "Saúde" | "Educação" | "Documentação" | "Trabalho e renda";
export type DemandaStatus = "Aberta" | "Em andamento" | "Encaminhada" | "Concluída";
export interface Demanda {
  id: string;
  familiaId: string;
  titulo: string;
  categoria: DemandaCategoria;
  status: DemandaStatus;
  data: string;
}
export interface Atendimento {
  id: string;
  familiaId: string;
  data: string;
  tipo: "Acolhimento" | "Visita" | "Retorno" | "Orientação";
  profissional: string;
  resumo: string;
}
export interface Encaminhamento {
  id: string;
  familiaId: string;
  data: string;
  destino: string;
  motivo: string;
  status: "Enviado" | "Recebido" | "Concluído";
}
export interface Modalidade {
  id: string;
  nome: string;
  area: "Esporte" | "Arte e cultura" | "Reforço escolar" | "Tecnologia";
  descricao: string;
}
export interface Turma {
  id: string;
  modalidadeId: string;
  nome: string;
  professor: string;
  dias: string[];
  horario: string;
  local: string;
  capacidade: number;
}
export type MatriculaStatus = "Ativa" | "Trancada" | "Concluída" | "Lista de espera";
export interface Matricula {
  id: string;
  pessoaId: string;
  turmaId: string;
  status: MatriculaStatus;
  dataIngresso: string;
  responsavelLegal: string;
}
export type Presenca = "Presente" | "Falta" | "Falta justificada";
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: "Administrador" | "Assistente social" | "Educador" | "Recepção";
  ativo: boolean;
}
