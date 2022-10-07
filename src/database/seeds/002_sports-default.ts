import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // await knex("sports").del();

  await knex("sports").insert([
    { id: 1, name: "Futbol", created_at: new Date() },
    { id: 2, name: "Billar", created_at: new Date() },
    { id: 3, name: "Bolleyball", created_at: new Date() },
  ]);
}
