import { TransactionCategory } from "../../database/migrations/20221005222240_app-migration";
import { DateColumnsEntity } from "../../users/models/user.model";

export interface Transaction {
  id: number;
  user_id: number;
  amount: number;
  category: TransactionCategory;
  status: boolean;
  user_bets: number; // this is user_bets_id also named
}

export type TransactionEntity = Transaction | DateColumnsEntity;
