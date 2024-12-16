import { ReactNode } from "react";

export interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  children: ReactNode;
  title?: string;
  variant?: "bottom-sheet" | "center";
}

export interface BaseFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  onSubmit: () => void;
  onToggleMode: () => void;
}

export interface IconProps {
  svgPath?: string;
  size?: number;
  color?: string;
  fallbackType?: "expense" | "income";
}

export type ModalView =
  | "main"
  | "addBank"
  | "addAccount"
  | "addCard"
  | "bankSelection"
  | "categorySelection";
