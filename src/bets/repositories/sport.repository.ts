import { Knex } from "knex";

export class SportRepository {
  private tableName: string = "sports";
  constructor(private knex: Knex) {}
  async findAll() {
    return this.knex<Event>(this.tableName).select("*");
  }
}
