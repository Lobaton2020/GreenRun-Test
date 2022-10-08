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
}
