import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface BankCard {
  id: string;
  lastFourDigits: string;
  type: "credit" | "debit";
}

interface BankAccount {
  id: string;
  accountNumber: string;
  currentBalance: number;
  cards: BankCard[];
}

interface Bank {
  id: string;
  name: string;
  accounts: BankAccount[];
}

export function useBanks() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBanks = async () => {
    try {
      const { data: banksData, error: banksError } = await supabase.from(
        "user_banks"
      ).select(`
          id,
          bank_name,
          bank_accounts (
            id,
            account_number,
            current_balance,
            bank_cards (
              id,
              last_four_digits,
              card_type
            )
          )
        `);

      if (banksError) throw banksError;

      setBanks(
        banksData.map((bank) => ({
          id: bank.id,
          name: bank.bank_name,
          accounts:
            bank.bank_accounts?.map((account) => ({
              id: account.id,
              accountNumber: account.account_number,
              currentBalance: account.current_balance,
              cards:
                account.bank_cards?.map((card) => ({
                  id: card.id,
                  lastFourDigits: card.last_four_digits,
                  type: card.card_type,
                })) || [],
            })) || [],
        }))
      );
    } catch (error) {
      console.error("Error fetching banks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const addBank = async (bankName: string) => {
    try {
      const { data, error } = await supabase
        .from("user_banks")
        .insert({ bank_name: bankName })
        .select()
        .single();

      if (error) throw error;

      setBanks((prev) => [
        ...prev,
        { id: data.id, name: data.bank_name, accounts: [] },
      ]);
      return data;
    } catch (error) {
      console.error("Error adding bank:", error);
      throw error;
    }
  };

  const addAccount = async (
    bankId: string,
    accountNumber: string,
    initialBalance: number
  ) => {
    try {
      const { data, error } = await supabase
        .from("bank_accounts")
        .insert({
          user_bank_id: bankId,
          account_number: accountNumber,
          current_balance: initialBalance,
        })
        .select()
        .single();

      if (error) throw error;

      setBanks((prev) =>
        prev.map((bank) =>
          bank.id === bankId
            ? {
                ...bank,
                accounts: [
                  ...bank.accounts,
                  {
                    id: data.id,
                    accountNumber: data.account_number,
                    currentBalance: data.current_balance,
                    cards: [],
                  },
                ],
              }
            : bank
        )
      );
      return data;
    } catch (error) {
      console.error("Error adding account:", error);
      throw error;
    }
  };

  const addCard = async (
    accountId: string,
    lastFourDigits: string,
    type: "credit" | "debit"
  ) => {
    try {
      const { data, error } = await supabase
        .from("bank_cards")
        .insert({
          bank_account_id: accountId,
          last_four_digits: lastFourDigits,
          card_type: type,
        })
        .select()
        .single();

      if (error) throw error;

      setBanks((prev) =>
        prev.map((bank) => ({
          ...bank,
          accounts: bank.accounts.map((account) =>
            account.id === accountId
              ? {
                  ...account,
                  cards: [
                    ...account.cards,
                    {
                      id: data.id,
                      lastFourDigits: data.last_four_digits,
                      type: data.card_type,
                    },
                  ],
                }
              : account
          ),
        }))
      );
      return data;
    } catch (error) {
      console.error("Error adding card:", error);
      throw error;
    }
  };

  return {
    banks,
    loading,
    addBank,
    addAccount,
    addCard,
    refreshBanks: fetchBanks,
  };
}
