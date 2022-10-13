import { Knex } from "knex";
interface IRepository {
  findAll(where?: object): Promise<any>;
}
export class BaseRepository implements IRepository {
  constructor(
    private readonly tableName: string,
    private readonly knex: Knex
  ) {}

  findAll() {
    return this.knex(this.tableName).select("*");
  }
  create(payload: object) {
    return this.knex.insert(payload).into(this.tableName);
  }
  findOne(id: number | undefined) {
    return this.knex(this.tableName).where({ id }).first();
  }

  findBy(filter: object) {
    return this.knex(this.tableName).where(filter).first();
  }

  update(id: number, payload: object) {
    this.knex.update(payload).where({ id }).into(this.tableName);
  }
}
