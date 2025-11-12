export type AttrKey = "des" | "for" | "con" | "int" | "sab" | "car";

export interface SkillBase {
  nome: string;
  atr: AttrKey;
}

export interface SkillComputed extends SkillBase {
  trained: boolean;
  value: number;
}