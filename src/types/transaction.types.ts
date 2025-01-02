import { FrequencyType } from "./recurrent.types";

export type TransactionType = "expense" | "income";

export interface PaymentMethod {
  bank: string;
  lastFourDigits: string;
  type: "credit" | "debit";
  accountNumber: string;
}

export interface Transaction {
  id: number | string;
  user_id: string;
  type: TransactionType;
  category: string | null;
  subcategory: string | null;
  name: string;
  amount: number;
  date: string;
  created_at: string;
  is_recurrent: boolean;
  is_virtual_recurrent?: boolean;
  original_transaction?: Transaction;
  total_spent: number | null;
  payment_bank: string;
  payment_last_four: string;
  payment_type: "credit" | "debit";
  icon_id: string;
  icon?: {
    svg_path: string;
    name: string;
  } | null;
  account_number: string;
  recurrent_transaction_id: string | null;
  recurrent_transaction?: {
    id: string;
    frequency_name: FrequencyType;
    frequency_days: number | null;
    start_date: string;
    end_date?: string;
  } | null;
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
