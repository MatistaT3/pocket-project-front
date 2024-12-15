import { ImageSourcePropType } from "react-native";

export interface BankCard {
  id: string;
  lastFourDigits: string;
  type: "credit" | "debit";
}

export interface BankAccount {
  id: string;
  accountNumber: string;
  currentBalance: number;
  cards: BankCard[];
}

export interface Bank {
  id: string;
  name: string;
  accounts: BankAccount[];
}

export interface BankApp {
  appName: string;
  scheme?: string;
  androidPackage?: string;
  iosId?: string;
  icon?: any; // Podríamos tiparlo mejor con ImageSourcePropType de react-native
  hasApp: boolean;
}

// Props interfaces
export interface BankAccountsModalProps {
  visible: boolean;
  onClose: () => void;
}

export interface BankFormData {
  name: string;
}

export interface AccountFormData {
  accountNumber: string;
  initialBalance: string;
}

export interface CardFormData {
  lastFourDigits: string;
  type: "credit" | "debit";
}

export interface BankApp {
  appName: string;
  scheme?: string;
  androidPackage?: string;
  iosId?: string;
  icon?: any;
  hasApp: boolean;
}
