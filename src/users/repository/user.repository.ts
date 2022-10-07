import { Knex, knex } from "knex";
import { UserState } from "../../database/migrations/20221005222240_app-migration";
import { User, UserEntity } from "../models/user.model";

export class UserRepository {
  private tableName: string = "users";
  constructor(private knex: Knex) {}
  async findAll() {
    return this.knex<UserEntity>(this.tableName).select("*");
  }
  async findOneWitoutPassword(id: number) {
    const { password: _, ...rest }: User = await this.knex(this.tableName)
      .where({ id })
      .first();
    return { ...rest };
  }
  async create(payload: UserEntity) {
     const id = (await this.knex
       .insert(payload)
       .into(this.tableName)
       .first()) as number;
     return this.findOneWitoutPassword(id);

  }

  findByEmail(email: string) {
    return this.knex(this.tableName)
      .where({ email, user_state: UserState.ACTIVE })
      .first();
  }

  findOne(id: number) {
    return this.knex(this.tableName).where({ id }).first();
  }

  async update(userId: number, payload: UserEntity) {
    await this.knex.update(payload).where({ id: userId,  }).into(this.tableName);
  }
}
