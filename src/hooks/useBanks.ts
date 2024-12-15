import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

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
  const { session } = useAuth();

  const fetchBanks = async () => {
    try {
      const { data: banksData, error: banksError } = await supabase
        .from("user_banks")
        .select(
          `
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
        `
        )
        .eq("user_id", session?.user.id);

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
    if (session?.user.id) {
      fetchBanks();
    }
  }, [session?.user.id]);

  const addBank = async (bankName: string) => {
    if (!session?.user.id) {
      throw new Error("User must be logged in to add a bank");
    }

    try {
      const { data, error } = await supabase
        .from("user_banks")
        .insert({
          bank_name: bankName,
          user_id: session.user.id,
        })
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

  const deleteBank = async (bankId: string) => {
    try {
      // Primero obtenemos todas las cuentas asociadas al banco
      const { data: accounts, error: accountsError } = await supabase
        .from("bank_accounts")
        .select("id")
        .eq("user_bank_id", bankId);

      if (accountsError) throw accountsError;

      // Si hay cuentas, eliminamos primero sus tarjetas
      if (accounts && accounts.length > 0) {
        const accountIds = accounts.map((account) => account.id);

        // Eliminar todas las tarjetas asociadas a estas cuentas
        const { error: cardsError } = await supabase
          .from("bank_cards")
          .delete()
          .in("bank_account_id", accountIds);

        if (cardsError) throw cardsError;

        // Eliminar todas las cuentas del banco
        const { error: accountsDeleteError } = await supabase
          .from("bank_accounts")
          .delete()
          .eq("user_bank_id", bankId);

        if (accountsDeleteError) throw accountsDeleteError;
      }

      // Finalmente eliminamos el banco
      const { error: bankError } = await supabase
        .from("user_banks")
        .delete()
        .eq("id", bankId);

      if (bankError) throw bankError;

      // Actualizar el estado local
      setBanks((prev) => prev.filter((bank) => bank.id !== bankId));
    } catch (error) {
      console.error("Error deleting bank:", error);
      throw error;
    }
  };

  const deleteAccount = async (accountId: string) => {
    try {
      // Primero eliminamos todas las tarjetas asociadas
      const { error: cardsError } = await supabase
        .from("bank_cards")
        .delete()
        .eq("bank_account_id", accountId);

      if (cardsError) throw cardsError;

      // Luego eliminamos la cuenta
      const { error: accountError } = await supabase
        .from("bank_accounts")
        .delete()
        .eq("id", accountId);

      if (accountError) throw accountError;

      // Actualizar el estado local
      setBanks((prev) =>
        prev.map((bank) => ({
          ...bank,
          accounts: bank.accounts.filter((account) => account.id !== accountId),
        }))
      );
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  };

  const deleteCard = async (cardId: string, accountId: string) => {
    try {
      const { error } = await supabase
        .from("bank_cards")
        .delete()
        .eq("id", cardId);

      if (error) throw error;

      // Actualizar el estado local
      setBanks((prev) =>
        prev.map((bank) => ({
          ...bank,
          accounts: bank.accounts.map((account) =>
            account.id === accountId
              ? {
                  ...account,
                  cards: account.cards.filter((card) => card.id !== cardId),
                }
              : account
          ),
        }))
      );
    } catch (error) {
      console.error("Error deleting card:", error);
      throw error;
    }
  };

  return {
    banks,
    loading,
    addBank,
    addAccount,
    addCard,
    deleteBank,
    deleteAccount,
    deleteCard,
    refreshBanks: fetchBanks,
  };
}
