import { Knex } from "knex";

export class EventRepository {
  private tableName: string = "events";
  constructor(private knex: Knex) {}
  async findAll() {
    return this.knex<Event>(this.tableName).select("*");
  }
}
