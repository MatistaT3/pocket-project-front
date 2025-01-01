import { FrequencyType } from "./recurrent.types";

export type TransactionType = "expense" | "income";

export interface PaymentMethod {
  bank: string;
  lastFourDigits: string;
  type: "credit" | "debit";
  accountNumber: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  subcategory?: string;
  name: string;
  amount: number;
  date: string;
  icon_data?: {
    svg_path: string;
  };
  paymentMethod: PaymentMethod;
  is_recurrent: boolean;
  recurrent_transaction_id?: string;
}

// Props interfaces
export interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => Promise<void>;
}

export interface TransactionFormData {
  type: TransactionType;
  category: string;
  subcategory: string;
  name: string;
  amount: string;
  date: Date;
  selectedBank: string | null;
  selectedAccount: string | null;
  selectedCard: string | null;
  bankName: string;
  accountNumber: string;
  cardLastFour: string;
  cardType: "credit" | "debit";
  isRecurrent: boolean;
  recurrentConfig: {
    frequency: FrequencyType;
    customDays?: number;
  };
  otherCategorySuggestion: string;
}

export interface TransactionDetailsProps {
  visible: boolean;
  onClose: () => void;
  date: string;
  transactions: Transaction[];
}

export type RecurrencyFrequency =
  | "daily"
  | "monthly"
  | "bimonthly"
  | "quarterly"
  | "semiannual"
  | "custom";
