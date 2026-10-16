// Camada de acesso a dados. Hoje lê os dados de demonstração em memória;
// no futuro, troque as implementações por chamadas ao banco real sem alterar as páginas.
import * as demo from "./demo";
import type { Familia } from "./types";

export const repo = {
  familias: () => demo.familias,
  familia: (id: string) => demo.familias.find((f) => f.id === id),
  pessoas: () => demo.pessoas,
  pessoa: (id: string) => demo.pessoas.find((p) => p.id === id),
  pessoasDaFamilia: (id: string) => demo.pessoas.filter((p) => p.familiaId === id),
  demandas: () => demo.demandas,
  atendimentos: () => [...demo.atendimentos].sort((a, b) => b.data.localeCompare(a.data)),
  encaminhamentos: () => demo.encaminhamentos,
  modalidades: () => demo.modalidades,
  modalidade: (id: string) => demo.modalidades.find((m) => m.id === id),
  turmas: () => demo.turmas,
  turma: (id: string) => demo.turmas.find((t) => t.id === id),
  matriculas: () => demo.matriculas,
  usuarios: () => demo.usuarios,
};

export function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}

/** Prevenção de duplicidade: retorna famílias com responsável de nome parecido ou mesmo telefone. */
export function possiveisDuplicadas(dados: { responsavel: string; telefone: string }, ignorarId?: string): Familia[] {
  const nome = normalizar(dados.responsavel);
  const tel = dados.telefone.replace(/\D/g, "");
  if (nome.length < 4 && tel.length < 8) return [];
  const tokens = nome.split(" ").filter((t) => t.length > 2);
  return demo.familias.filter((f) => {
    if (f.id === ignorarId) return false;
    const fn = normalizar(f.responsavel);
    const mesmoTel = tel.length >= 8 && f.telefone.replace(/\D/g, "") === tel;
    const comuns = tokens.filter((t) => fn.split(" ").includes(t)).length;
    return mesmoTel || fn === nome || (tokens.length >= 2 && comuns >= 2);
  });
}

export const idade = (ano: number) => new Date().getFullYear() - ano;
export const dataBR = (iso: string) => iso.split("-").reverse().join("/");
