export type TransactionType = "expense" | "income";
export type TransactionCategory =
  | "subscription"
  | "regular"
  | "salary"
  | "other";
export type PaymentMethod = {
  bank: string;
  lastFourDigits: string;
  type: "credit" | "debit";
};

export type RecurrencyFrequency =
  | "daily"
  | "monthly"
  | "bimonthly"
  | "quarterly"
  | "semiannual"
  | "custom";

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
  paymentMethod: {
    bank: string;
    lastFourDigits: string;
    type: "credit" | "debit";
  };
  recurrent?: RecurrentConfig;
}
