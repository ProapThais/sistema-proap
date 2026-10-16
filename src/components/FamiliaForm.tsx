import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Card, Field, Input, Select, Btn, btnClass } from "@/components/ui-kit";
import { possiveisDuplicadas } from "@/data/repository";
import type { Familia } from "@/data/types";

export function FamiliaForm({ inicial }: { inicial?: Familia }) {
  const navigate = useNavigate();
  const [f, setF] = useState({
    responsavel: inicial?.responsavel ?? "", telefone: inicial?.telefone ?? "", bairro: inicial?.bairro ?? "",
    status: inicial?.status ?? "Ativa", observacoes: inicial?.observacoes ?? "",
  });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [confirmado, setConfirmado] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const dup = possiveisDuplicadas(f, inicial?.id);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setF({ ...f, [k]: e.target.value }); setConfirmado(false); };

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (f.responsavel.trim().length < 3) er.responsavel = "Informe o nome do responsável (mínimo 3 letras).";
    if (!f.bairro.trim()) er.bairro = "Informe o bairro.";
    setErros(er);
    if (Object.keys(er).length || (dup.length && !confirmado)) return;
    setSalvo(true);
  }

  if (salvo) return (
    <Card className="text-center">
      <h2 className="text-xl font-semibold">Simulação concluída</h2>
      <p className="mt-2 text-sm text-muted-foreground">Nesta versão de demonstração os dados não são gravados. A integração com o banco de dados será feita em etapa futura.</p>
      <div className="mt-4 flex justify-center gap-2"><Btn onClick={() => navigate({ to: "/familias" })}>Voltar para Famílias</Btn></div>
    </Card>
  );

  return (
    <form onSubmit={salvar} noValidate className="space-y-6">
      <Card>
        <h2 className="mb-4 text-lg font-semibold">Dados do responsável</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome do responsável" id="responsavel" required>
            <Input id="responsavel" value={f.responsavel} onChange={set("responsavel")} aria-invalid={!!erros.responsavel} aria-describedby="responsavel-err" autoComplete="off" />
            {erros.responsavel && <p id="responsavel-err" className="text-xs text-destructive">{erros.responsavel}</p>}
          </Field>
          <Field label="Telefone de contato" id="telefone" hint="Use apenas números fictícios nesta demonstração.">
            <Input id="telefone" inputMode="tel" value={f.telefone} onChange={set("telefone")} aria-describedby="telefone-hint" placeholder="(00) 0000-0000" />
          </Field>
          <Field label="Bairro" id="bairro" required>
            <Input id="bairro" value={f.bairro} onChange={set("bairro")} aria-invalid={!!erros.bairro} aria-describedby="bairro-err" />
            {erros.bairro && <p id="bairro-err" className="text-xs text-destructive">{erros.bairro}</p>}
          </Field>
          <Field label="Situação" id="status">
            <Select id="status" value={f.status} onChange={set("status")}><option>Ativa</option><option>Em acompanhamento</option><option>Inativa</option></Select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Observações gerais" id="obs" hint="Não registre informações sensíveis nesta demonstração.">
              <textarea id="obs" rows={3} value={f.observacoes} onChange={set("observacoes")} aria-describedby="obs-hint" className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm" />
            </Field>
          </div>
        </div>
      </Card>

      {dup.length > 0 && (
        <div role="alert" className="rounded-xl border border-warning bg-warning/15 p-4 text-sm">
          <p className="font-semibold text-warning-foreground">Possível cadastro duplicado</p>
          <p className="mt-1">Encontramos família(s) parecida(s). Verifique antes de continuar:</p>
          <ul className="mt-2 list-disc pl-5">
            {dup.map((d) => <li key={d.id}><Link to="/familias/$id" params={{ id: d.id }} className="font-medium underline">{d.responsavel}</Link> — {d.codigo}, {d.bairro}</li>)}
          </ul>
          <label className="mt-3 flex items-center gap-2"><input type="checkbox" checked={confirmado} onChange={(e) => setConfirmado(e.target.checked)} /> Conferi e não se trata da mesma família</label>
        </div>
      )}

      <div className="flex flex-wrap justify-end gap-2">
        <Link to="/familias" className={btnClass("outline")}>Cancelar</Link>
        <Btn type="submit" disabled={dup.length > 0 && !confirmado}>{inicial ? "Salvar alterações" : "Cadastrar família"}</Btn>
      </div>
    </form>
  );
}
