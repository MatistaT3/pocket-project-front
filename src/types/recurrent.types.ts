export type FrequencyType =
  | "weekly"
  | "monthly"
  | "bimonthly"
  | "quarterly"
  | "semiannual"
  | "annual"
  | "custom";

export const FREQUENCY_PRESETS: Record<FrequencyType, number> = {
  weekly: 7,
  monthly: 30,
  bimonthly: 60,
  quarterly: 90,
  semiannual: 180,
  annual: 365,
  custom: 0,
};

export interface RecurrentTransaction {
  id: string;
  user_id: string;
  type: "expense" | "income";
  category: string | null;
  subcategory: string | null;
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
  created_at?: string;
  updated_at?: string;
  icon_id: string;
}
