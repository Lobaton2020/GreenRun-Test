import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // await knex("bets").del();

  await knex("bets").insert([
    {
      bet_option: "1",
      status: "ACTIVE",
      name: "Colombia",
      created_at: new Date(),
      result: "WON",
      odd: 1.5,
      event_id: 1,
      sport_id: 1,
    },
    {
      bet_option: "2",
      status: "ACTIVE",
      name: "Qatar",
      created_at: new Date(),
      result: "WON",
      odd: 3,
      event_id: 1,
      sport_id: 1,
    },

    {
      bet_option: "3",
      status: "ACTIVE",
      name: "Alemania",
      created_at: new Date(),
      result: "LOST",
      odd: 2,
      event_id: 1,
      sport_id: 1,
    },
    {
      bet_option: "1",
      status: "ACTIVE",
      name: "Pedro gomez",
      created_at: new Date(),
      result: "WON",
      odd: 3.1,
      event_id: 2,
      sport_id: 2,
    },
    {
      bet_option: "2",
      status: "ACTIVE",
      name: "Juan perez",
      created_at: new Date(),
      result: "LOST",
      odd: 2.1,
      event_id: 2,
      sport_id: 2,
    },

    {
      bet_option: "3",
      status: "ACTIVE",
      name: "Camilo duque",
      created_at: new Date(),
      result: "WON",
      odd: 1.0,
      event_id: 2,
      sport_id: 2,
    },
  ]);
}
