import { Knex } from "knex";
import { TransactionCategory } from "../../database/migrations/20221005222240_app-migration";
import { Transaction, TransactionEntity } from "../models/transaction.model";

export class TransactionsRepository {
  private tableName: string = "transactions";
  constructor(private knex: Knex) {}
  async findAll(where: object = {}) {
    return this.knex<Transaction[]>(this.tableName).select("*").where(where);
  }
  async findAllByUser(userId: number, where: object = {}) {
    return this.knex(this.tableName)
      .where({ user_id: userId, ...where })
      .select("*");
  }

  async create(payload: TransactionEntity) {
    const [id] = await this.knex.insert(payload).into(this.tableName);
    return this.findOne(id);
  }
  findOne(id: number | undefined) {
    return this.knex(this.tableName).where({ id }).first();
  }
  findAllActiveByCategory(userId: number, category: string) {
    return this.knex(this.tableName)
      .where({
        status: true,
        category,
        user_id: userId,
      }) // here in the future we need add the option deleted to do the validation
      .select("*");
  }

  // Instead add this method there we can add a new layer called Service, If the login growth a lot' I'll do it
  getTotalDeposit(userId: number): Promise<number[]> {
    return this.getTotalByCategory(userId, TransactionCategory.DEPOSIT);
  }
  getTotalWithDraw(userId: number): Promise<number[]> {
    return this.getTotalByCategory(userId, TransactionCategory.WITHDRAW);
  }
  getTotalBet(userId: number): Promise<number[]> {
    return this.getTotalByCategory(userId, TransactionCategory.BET);
  }
  getTotalWinning(userId: number): Promise<number[]> {
    return this.getTotalByCategory(userId, TransactionCategory.WINNING);
  }
  private async getTotalByCategory(userId: number, category: string) {
    const transactionCategoryList: Transaction[] =
      await this.findAllActiveByCategory(userId, category);
    const total = transactionCategoryList.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );
    return [transactionCategoryList?.length || 0, total || 0];
  }
  async isAvailableDoWithdrawOrBet(amount: number, userId: number) {
    const [_, totalDeposit] = await this.getTotalDeposit(userId);
    const [__, totalWithDraw] = await this.getTotalWithDraw(userId);
    const [___, totalBets] = await this.getTotalBet(userId);
    return totalDeposit - (totalWithDraw + totalBets) > amount;
  }
}
