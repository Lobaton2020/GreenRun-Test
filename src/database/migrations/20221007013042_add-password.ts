import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("users", (table) => {
    table.string("password", 128);
  });
}

export async function down(knex: Knex): Promise<void> {}
