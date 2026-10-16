// DADOS EXCLUSIVAMENTE FICTÍCIOS para demonstração da interface.
// Nenhum nome, telefone ou informação corresponde a pessoas reais.
import type { Atendimento, Demanda, Encaminhamento, Familia, Matricula, Modalidade, Pessoa, Turma, Usuario } from "./types";

export const familias: Familia[] = [
  { id: "f1", codigo: "DEMO-0001", responsavel: "Ana Exemplo da Silva", bairro: "Bairro Fictício A", telefone: "(00) 0000-0001", status: "Em acompanhamento", dataCadastro: "2026-02-10", observacoes: "Registro de demonstração." },
  { id: "f2", codigo: "DEMO-0002", responsavel: "Bruno Teste Souza", bairro: "Bairro Fictício B", telefone: "(00) 0000-0002", status: "Ativa", dataCadastro: "2026-03-04", observacoes: "" },
  { id: "f3", codigo: "DEMO-0003", responsavel: "Carla Modelo Pereira", bairro: "Bairro Fictício A", telefone: "(00) 0000-0003", status: "Ativa", dataCadastro: "2026-03-22", observacoes: "" },
  { id: "f4", codigo: "DEMO-0004", responsavel: "Daniel Amostra Lima", bairro: "Bairro Fictício C", telefone: "(00) 0000-0004", status: "Inativa", dataCadastro: "2025-11-15", observacoes: "" },
  { id: "f5", codigo: "DEMO-0005", responsavel: "Elisa Simulada Costa", bairro: "Bairro Fictício B", telefone: "(00) 0000-0005", status: "Em acompanhamento", dataCadastro: "2026-05-02", observacoes: "" },
  { id: "f6", codigo: "DEMO-0006", responsavel: "Fábio Ilustrativo Rocha", bairro: "Bairro Fictício C", telefone: "(00) 0000-0006", status: "Ativa", dataCadastro: "2026-06-18", observacoes: "" },
];

export const pessoas: Pessoa[] = [
  { id: "p1", familiaId: "f1", nome: "Ana Exemplo da Silva", parentesco: "Responsável", anoNascimento: 1985 },
  { id: "p2", familiaId: "f1", nome: "Lucas Exemplo", parentesco: "Filho(a)", anoNascimento: 2014 },
  { id: "p3", familiaId: "f1", nome: "Marina Exemplo", parentesco: "Filho(a)", anoNascimento: 2016 },
  { id: "p4", familiaId: "f2", nome: "Bruno Teste Souza", parentesco: "Responsável", anoNascimento: 1979 },
  { id: "p5", familiaId: "f2", nome: "Júlia Teste", parentesco: "Filho(a)", anoNascimento: 2012 },
  { id: "p6", familiaId: "f3", nome: "Carla Modelo Pereira", parentesco: "Responsável", anoNascimento: 1990 },
  { id: "p7", familiaId: "f3", nome: "Pedro Modelo", parentesco: "Filho(a)", anoNascimento: 2015 },
  { id: "p8", familiaId: "f5", nome: "Elisa Simulada Costa", parentesco: "Responsável", anoNascimento: 1988 },
  { id: "p9", familiaId: "f5", nome: "Rafael Simulado", parentesco: "Neto(a)", anoNascimento: 2013 },
  { id: "p10", familiaId: "f6", nome: "Fábio Ilustrativo Rocha", parentesco: "Responsável", anoNascimento: 1982 },
  { id: "p11", familiaId: "f6", nome: "Sofia Ilustrativa", parentesco: "Filho(a)", anoNascimento: 2011 },
];

export const demandas: Demanda[] = [
  { id: "d1", familiaId: "f1", titulo: "Orientação sobre material escolar", categoria: "Educação", status: "Em andamento", data: "2026-09-02" },
  { id: "d2", familiaId: "f1", titulo: "Apoio para emissão de documento", categoria: "Documentação", status: "Encaminhada", data: "2026-08-15" },
  { id: "d3", familiaId: "f2", titulo: "Cesta de alimentos (exemplo)", categoria: "Alimentação", status: "Concluída", data: "2026-07-20" },
  { id: "d4", familiaId: "f3", titulo: "Informações sobre cursos", categoria: "Trabalho e renda", status: "Aberta", data: "2026-10-01" },
  { id: "d5", familiaId: "f5", titulo: "Orientação sobre atendimento de saúde", categoria: "Saúde", status: "Aberta", data: "2026-10-08" },
  { id: "d6", familiaId: "f6", titulo: "Pequenos reparos na residência", categoria: "Moradia", status: "Em andamento", data: "2026-09-25" },
];

export const atendimentos: Atendimento[] = [
  { id: "a1", familiaId: "f1", data: "2026-10-10", tipo: "Retorno", profissional: "Profissional Demo 1", resumo: "Acompanhamento de demanda educacional (texto ilustrativo)." },
  { id: "a2", familiaId: "f1", data: "2026-09-02", tipo: "Acolhimento", profissional: "Profissional Demo 1", resumo: "Primeiro contato e escuta (texto ilustrativo)." },
  { id: "a3", familiaId: "f2", data: "2026-07-20", tipo: "Orientação", profissional: "Profissional Demo 2", resumo: "Orientação geral (texto ilustrativo)." },
  { id: "a4", familiaId: "f3", data: "2026-10-01", tipo: "Acolhimento", profissional: "Profissional Demo 2", resumo: "Registro inicial (texto ilustrativo)." },
  { id: "a5", familiaId: "f5", data: "2026-10-08", tipo: "Visita", profissional: "Profissional Demo 1", resumo: "Visita de demonstração (texto ilustrativo)." },
  { id: "a6", familiaId: "f6", data: "2026-09-25", tipo: "Acolhimento", profissional: "Profissional Demo 3", resumo: "Escuta inicial (texto ilustrativo)." },
];

export const encaminhamentos: Encaminhamento[] = [
  { id: "e1", familiaId: "f1", data: "2026-08-16", destino: "Serviço Fictício de Documentação", motivo: "Emissão de documento", status: "Recebido" },
  { id: "e2", familiaId: "f5", data: "2026-10-09", destino: "Unidade de Saúde Fictícia", motivo: "Orientação de atendimento", status: "Enviado" },
];

export const modalidades: Modalidade[] = [
  { id: "m1", nome: "Futsal", area: "Esporte", descricao: "Atividade esportiva coletiva." },
  { id: "m2", nome: "Música — Violão", area: "Arte e cultura", descricao: "Iniciação musical." },
  { id: "m3", nome: "Reforço de Matemática", area: "Reforço escolar", descricao: "Apoio ao conteúdo escolar." },
  { id: "m4", nome: "Informática Básica", area: "Tecnologia", descricao: "Introdução ao computador." },
];

export const turmas: Turma[] = [
  { id: "t1", modalidadeId: "m1", nome: "Futsal Infantil A", professor: "Professor Demo 1", dias: ["Seg", "Qua"], horario: "14:00–15:30", local: "Quadra (exemplo)", capacidade: 20 },
  { id: "t2", modalidadeId: "m2", nome: "Violão Iniciante", professor: "Professora Demo 2", dias: ["Ter", "Qui"], horario: "09:00–10:00", local: "Sala 2 (exemplo)", capacidade: 10 },
  { id: "t3", modalidadeId: "m3", nome: "Matemática 6º ano", professor: "Professora Demo 3", dias: ["Seg", "Qua", "Sex"], horario: "10:00–11:00", local: "Sala 1 (exemplo)", capacidade: 15 },
  { id: "t4", modalidadeId: "m4", nome: "Informática Turma 1", professor: "Professor Demo 4", dias: ["Sex"], horario: "15:00–17:00", local: "Laboratório (exemplo)", capacidade: 12 },
];

export const matriculas: Matricula[] = [
  { id: "mt1", pessoaId: "p2", turmaId: "t1", status: "Ativa", dataIngresso: "2026-03-01", responsavelLegal: "Ana Exemplo da Silva" },
  { id: "mt2", pessoaId: "p3", turmaId: "t2", status: "Ativa", dataIngresso: "2026-03-01", responsavelLegal: "Ana Exemplo da Silva" },
  { id: "mt3", pessoaId: "p5", turmaId: "t3", status: "Ativa", dataIngresso: "2026-04-10", responsavelLegal: "Bruno Teste Souza" },
  { id: "mt4", pessoaId: "p7", turmaId: "t1", status: "Ativa", dataIngresso: "2026-04-12", responsavelLegal: "Carla Modelo Pereira" },
  { id: "mt5", pessoaId: "p9", turmaId: "t4", status: "Lista de espera", dataIngresso: "2026-09-30", responsavelLegal: "Elisa Simulada Costa" },
  { id: "mt6", pessoaId: "p11", turmaId: "t3", status: "Trancada", dataIngresso: "2026-02-20", responsavelLegal: "Fábio Ilustrativo Rocha" },
  { id: "mt7", pessoaId: "p11", turmaId: "t1", status: "Ativa", dataIngresso: "2026-05-05", responsavelLegal: "Fábio Ilustrativo Rocha" },
];

export const usuarios: Usuario[] = [
  { id: "u1", nome: "Usuário Demo Admin", email: "admin@exemplo.invalid", perfil: "Administrador", ativo: true },
  { id: "u2", nome: "Profissional Demo 1", email: "social1@exemplo.invalid", perfil: "Assistente social", ativo: true },
  { id: "u3", nome: "Professor Demo 1", email: "educador1@exemplo.invalid", perfil: "Educador", ativo: true },
  { id: "u4", nome: "Recepção Demo", email: "recepcao@exemplo.invalid", perfil: "Recepção", ativo: false },
];
