import { supabase } from "../lib/supabase";
import { Transaction } from "../types/transaction.types";

export const addTransaction = async (
  transaction: Omit<Transaction, "id" | "created_at">,
  accountData: { accountNumber: string }
) => {
  try {
    const { data, error: transactionError } = await supabase
      .from("transactions")
      .insert([transaction])
      .select();

    if (transactionError) throw transactionError;

    // Intentamos actualizar el saldo de la cuenta
    try {
      const { error: balanceError } = await supabase.rpc(
        "update_account_balance",
        {
          p_account_number: accountData.accountNumber,
          p_amount:
            transaction.type === "expense"
              ? -transaction.amount
              : transaction.amount,
        }
      );

      if (balanceError) {
        console.warn("Error updating account balance:", balanceError);
      }
    } catch (balanceError) {
      console.warn("Error calling update_account_balance:", balanceError);
    }

    return data[0];
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
};
