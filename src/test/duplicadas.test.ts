import { describe, expect, it } from "vitest";
import { possiveisDuplicadas } from "@/data/repository";

describe("prevenção de duplicidade", () => {
  it("detecta nome igual mesmo sem acento/maiúsculas", () => {
    expect(possiveisDuplicadas({ responsavel: "ana exemplo da silva", telefone: "" }).map((f) => f.id)).toContain("f1");
  });
  it("detecta mesmo telefone", () => {
    expect(possiveisDuplicadas({ responsavel: "Outro Nome", telefone: "(00) 0000-0002" }).map((f) => f.id)).toEqual(["f2"]);
  });
  it("ignora a própria família ao editar", () => {
    expect(possiveisDuplicadas({ responsavel: "Ana Exemplo da Silva", telefone: "" }, "f1")).toEqual([]);
  });
});
