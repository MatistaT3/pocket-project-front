export type TransactionType = "expense" | "income";

export type TransactionCategory =
  | "subscription"
  | "regular"
  | "salary"
  | "other";

export type RecurrencyFrequency =
  | "daily"
  | "monthly"
  | "bimonthly"
  | "quarterly"
  | "semiannual"
  | "custom";

export interface PaymentMethod {
  bank: string;
  lastFourDigits: string;
  type: "credit" | "debit";
}

export interface RecurrentConfig {
  frequency: RecurrencyFrequency;
  startDate: string;
  customDays?: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  name: string;
  amount: number;
  date: string;
  icon_data?: {
    svg_path: string;
  };
  paymentMethod: PaymentMethod;
  recurrent?: RecurrentConfig;
}

// Props interfaces
export interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => Promise<void>;
}

export interface TransactionFormData {
  type: TransactionType;
  category: TransactionCategory;
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
    frequency: RecurrencyFrequency;
    customDays: number;
  };
}

export interface TransactionDetailsProps {
  visible: boolean;
  onClose: () => void;
  date: string;
  transactions: Transaction[];
}
