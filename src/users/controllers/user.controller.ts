import * as Hapi from "@hapi/hapi";
import * as Boom from "@hapi/boom";
import {
  UserRole,
  UserState,
} from "../../database/migrations/20221005222240_app-migration";
import { User, UserEntity, UserJwt } from "../models/user.model";
import { UserRepository } from "../repository/user.repository";

export class UserController {
  constructor(readonly userRepository: UserRepository) {}

  async findAll() {
    //THIS IS JUST TESTING
    return this.userRepository.findAll();
  }

  async block(req: Hapi.Request) {
    let user: User = await this.userRepository.findOne(req.params.id);
    if (user.role.includes(UserRole.ADMIN)) {
      return Boom.badRequest("This user is an admin, you can't block it");
    }
    const payload = {
      user_state: UserState.BLOCKED,
      updated_at: new Date(),
    } as UserEntity;
    await this.userRepository.update(user.id, payload);
    user = Object.assign(user, payload);
    return user;
  }
}
