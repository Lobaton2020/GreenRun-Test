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
  findAll(userId: number | undefined, where: object = {}) {
    return this.knex(this.tableName)
      .where({ user_id: userId, ...where })
      .select("*");
  }

  findByBet(betId: number) {
    return this.knex(this.tableName).where({ bet_id: betId }).select("*");
  }
  async update(id: number, payload: object) {
    await this.knex.update(payload).where({ id }).into(this.tableName);
  }
}
