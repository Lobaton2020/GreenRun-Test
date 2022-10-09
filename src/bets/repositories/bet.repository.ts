import { Knex } from "knex";

export class BetRepository {
  private tableName: string = "bets";
  constructor(private knex: Knex) {}
  async findAll(where: object) {
    return this.knex(this.tableName)
      .where(where)
      .select("bets.*", "events.name as event", "sports.name as sport")
      .innerJoin("events", "events.id", "=", "bets.event_id")
      .innerJoin("sports", "sports.id", "=", "bets.sport_id");
  }

  findOne(id: number | undefined) {
    return this.knex(this.tableName).where({ id }).first();
  }
}
