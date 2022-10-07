import { Knex } from "knex";
import { Bet } from "../models/bet.model";

export class BetRepository {
  private tableName: string = "bets";
  constructor(private knex: Knex) {}
  async findAll() {
    return this.knex(this.tableName)
      .select("bets.*", "events.name as event", "sports.name as sport")
      .innerJoin("events", "events.id", "=", "bets.event_id")
      .innerJoin("sports", "sports.id", "=", "bets.sport_id");
  }
}
