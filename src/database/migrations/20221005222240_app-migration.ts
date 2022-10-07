import { Knex } from "knex";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}
export enum UserGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}
export enum UserState {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export enum TransactionCategory {
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
  BET = "BET",
  WINNING = "WINNING",
}
export enum BetStatus {
  ACTIVE = "ACTIVE",
  CANCELED = "CANCELED",
  SETTLED = "SETTLED",
}

export enum BetResult {
  WON = "WON",
  LOST = "LOST",
}

export enum UserBetState {
  WON = "WON",
  OPEN = "OPEN",
  SETTLED = "SETTLED",
}

const addDateCommonColumns = (table: Knex.CreateTableBuilder): void => {
  table.datetime("created_at");
  table.datetime("updated_at");
  table.boolean("deleted");
  table.datetime("deleted_at");
};

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table: Knex.CreateTableBuilder) => {
    table.increments("id", { primaryKey: true });
    table.enum("role", Object.values(UserRole));
    table.string("first_name");
    table.string("last_name");
    table.string("phone", 50);
    table.string("email", 200);
    table.string("username", 200);
    table.string("address", 200);
    table.enum("gender", Object.values(UserGender));
    table.date("birth_date");
    table.smallint("country_id"); // Here we could create another table to do the relation
    table.string("city");
    table.enum("user_state", Object.values(UserState));
    table.string("category");
    addDateCommonColumns(table);
  });

  await knex.schema.createTable("bets", (table: Knex.CreateTableBuilder) => {
    table.increments("id", { primaryKey: true });
    table.string("sport", 200);
    table.string("bet_option", 200);
    table.enum("status", Object.values(BetStatus));
    table.string("name", 200);
    table.string("event_id", 200);
    table.float("odd");
    table.enum("result", Object.values(BetResult)).nullable();
    addDateCommonColumns(table);
  });

  await knex.schema.createTable("user_bets", (table) => {
    table.increments("id", { primaryKey: true });
    table.integer("user_id").unsigned().references("id").inTable("users");
    table.integer("bet_id").unsigned().references("id").inTable("bets");
    table.float("odd");
    table.float("amount");
    table.enum("state", Object.values(UserBetState));
    addDateCommonColumns(table);
  });

  await knex.schema.createTable("transactions", (table) => {
    table.increments("id", { primaryKey: true });
    table.integer("user_id").unsigned().references("id").inTable("users");
    table.float("amount");
    table.enum("category", Object.values(TransactionCategory));
    table.boolean("status");
    table
      .integer("user_bets")
      .unsigned()
      .references("id")
      .inTable("user_bets")
      .nullable();
    addDateCommonColumns(table);
  });
}

export async function down(knex: Knex): Promise<void> {
  // Here we add detail about delete constrainst and delete tables
  knex.schema.raw("drop database test_greenrun_app;");
}
