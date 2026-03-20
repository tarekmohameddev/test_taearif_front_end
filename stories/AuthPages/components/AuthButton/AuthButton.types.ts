import type { ReactNode } from "react";

export interface AuthButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  isLoading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "link";
  className?: string;
}
