import { Knex } from "knex";
import { Bet } from "../models/bet.model";

export class UserBetRepository {
  private tableName: string = "user_bets";
  constructor(private knex: Knex) {}
  async create(payload: object) {
    const [id] = await this.knex.insert(payload).into(this.tableName);
    return this.findOne(id);
  }
  findOne(id: number | undefined) {
    return this.knex(this.tableName).where({ id }).first();
  }
}
