import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // await knex("events").del();

  await knex("events").insert([
    {
      id: 1,
      name: "Event The Middle year",
      date_event: new Date("2022-10-12T16:10:35.553Z"),
      created_at: new Date(),
    },
    {
      id: 2,
      name: "Event Summer",
      date_event: new Date("2022-10-19T16:10:35.553Z"),
      created_at: new Date(),
    },

    {
      id: 3,
      name: "Event The people",
      date_event: new Date("2022-10-24T16:10:35.553Z"),
      created_at: new Date(),
    },
  ]);
}
