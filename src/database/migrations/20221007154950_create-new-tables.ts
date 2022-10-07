import { Knex } from "knex";
import { addDateCommonColumns } from "./20221005222240_app-migration";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("events", (table: Knex.CreateTableBuilder) => {
    table.increments("id", { primaryKey: true });
    table.string("name", 200);
    table.date("date_event");
    addDateCommonColumns(table);
  });

  await knex.schema.createTable("sports", (table: Knex.CreateTableBuilder) => {
    table.increments("id", { primaryKey: true });
    table.string("name", 200);
    addDateCommonColumns(table);
  });

  await knex.schema.table("bets", async (table) => {
    table.dropColumn("event_id");
    table.dropColumn("sport");
  });

  await knex.schema.table("bets", async (table) => {
    table.integer("event_id").unsigned().references("id").inTable("events");
    table.integer("sport_id").unsigned().references("id").inTable("sports");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("events");
  await knex.schema.dropTable("sports");
}
