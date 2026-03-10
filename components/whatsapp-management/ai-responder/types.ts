export interface AIResponderModuleProps {
  selectedNumberId: number | null;
  onNumberChange?: (numberId: number | null) => void;
}

export type { AIResponderConfig, AIStats } from "../types";
