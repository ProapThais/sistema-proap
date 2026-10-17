import type { ReactNode, InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Info, ArrowUpRight, type LucideIcon } from "lucide-react";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-lg border bg-card p-5 shadow-(--shadow-panel)", className)}>{children}</section>;
}

const tones = {
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/25 text-warning-foreground",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
  accent: "bg-accent/15 text-accent",
};
export type Tone = keyof typeof tones;
export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone | undefined }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", tones[tone])}>{children}</span>;
}

export const statusTone: Record<string, Tone> = {
  Ativa: "success", "Em acompanhamento": "info", Inativa: "neutral",
  Aberta: "warning", "Em andamento": "info", Encaminhada: "accent", Concluída: "success",
  Trancada: "neutral", "Lista de espera": "warning",
  Enviado: "warning", Recebido: "info", Concluído: "success",
  Presente: "success", Falta: "danger", "Falta justificada": "warning",
};

export function Btn({ variant = "primary", className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost" }) {
  return <button {...p} className={cn(btnClass(variant), className)} />;
}
export function btnClass(variant: "primary" | "outline" | "ghost" = "primary") {
  const base = "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";
  return cn(base, {
    primary: "bg-action text-action-foreground hover:bg-action/85",
    outline: "border border-input bg-card text-foreground hover:bg-muted",
    ghost: "text-foreground hover:bg-muted",
  }[variant]);
}

const inputCls = "w-full min-h-11 rounded-md border border-input bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-ring transition-colors";
export function Field({ label, id, required, hint, children }: { label: string; id: string; required?: boolean; hint?: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium">
        {label} {required && <span className="text-destructive" aria-hidden>*</span>}
        {required && <span className="sr-only">(obrigatório)</span>}
      </label>
      {children}
      {hint && <p id={`${id}-hint`} className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
export function Input(p: InputHTMLAttributes<HTMLInputElement>) { return <input {...p} className={cn(inputCls, p.className)} />; }
export function Select(p: SelectHTMLAttributes<HTMLSelectElement>) { return <select {...p} className={cn(inputCls, p.className)} />; }

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-card shadow-(--shadow-panel)">
      <table className="w-full text-sm">
        <thead className="bg-muted/70 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>{head.map((h) => <th key={h} scope="col" className="px-4 py-3.5 font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y">{children}</tbody>
      </table>
    </div>
  );
}
export const td = "px-4 py-3 align-middle";

export function Stat({ label, value, note, icon: Icon = ArrowUpRight, tone = "primary" }: { label: string; value: string | number; note?: string; icon?: LucideIcon; tone?: Tone }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <p className="pt-1 text-sm font-medium text-muted-foreground">{label}</p>
        <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-md", tones[tone])}><Icon className="h-4 w-4" aria-hidden /></span>
      </div>
      <p className="mt-3 font-display text-4xl font-bold text-primary">{value}</p>
      {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
    </Card>
  );
}

export function DemoNotice({ children }: { children?: ReactNode }) {
  return (
    <p role="note" className="mb-6 flex items-start gap-2.5 rounded-md border border-info/20 bg-info/5 px-4 py-3 text-sm text-info">
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /><span><strong>Demonstração:</strong> {children ?? "valores ilustrativos gerados a partir de dados fictícios. Não representam resultados reais da PROAP."}</span>
    </p>
  );
}

export function SearchInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="flex-1 min-w-[200px]">
      <label className="sr-only" htmlFor="busca">{label}</label>
      <Input id="busca" type="search" placeholder={label} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">{children}</p>;
}

export function pageHead(title: string, description: string) {
  return {
    meta: [
      { title: `${title} — Sistema PROAP` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} — Sistema PROAP` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  };
}
