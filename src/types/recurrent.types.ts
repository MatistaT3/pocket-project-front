export const FREQUENCY_PRESETS = {
  weekly: 7,
  monthly: 30,
  bimonthly: 60,
  quarterly: 90,
  semiannual: 180,
  annual: 365,
  custom: null,
} as const;

export type FrequencyType = keyof typeof FREQUENCY_PRESETS;

export interface RecurrentTransaction {
  id: string;
  type: "expense" | "income";
  category: string;
  subcategory?: string;
  name: string;
  amount: number;
  frequency_days: number;
  start_date: string;
  end_date?: string;
  last_generated_date?: string;
  payment_bank: string;
  payment_last_four: string;
  payment_type: "credit" | "debit";
  account_number: string;
  is_active: boolean;
}
