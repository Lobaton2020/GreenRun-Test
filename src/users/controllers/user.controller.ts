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
    return this.userRepository.findAll();
  }

  async block(req: Hapi.Request) {
    let user: User = await this.userRepository.findOneWitoutPassword(req.params.id);
    if (!user) {
      return Boom.badRequest("User doesn't found");
    }
    if (user.role.includes(UserRole.ADMIN)) {
      return Boom.badRequest("This user is an admin, you can't block it");
    }
    const body = {
      user_state: UserState.BLOCKED,
    };
    return this.updateUser(body, user);
  }

  async update(req: Hapi.Request) {
    let user: User = await this.userRepository.findOneWitoutPassword(req.params.id);
    if (!user) {
      return Boom.badRequest("User doesn't found");
    }
    if (user.role.includes(UserRole.ADMIN)) {
      return Boom.badRequest(
        "This user is an admin, you can't update his information"
      );
    }
    return this.updateUser(req.payload, user);
  }

  async updateProfile(req: Hapi.Request) {
    let user: User = await this.userRepository.findOneWitoutPassword(req["user"].sub);
    if (!user) {
      return Boom.badRequest("User doesn't found");
    }
    return this.updateUser(req.payload, user);
  }

  private async updateUser(body: any, user: User): Promise<User> {
    const payload = {
      ...body,
      updated_at: new Date(),
    } as UserEntity;
    await this.userRepository.update(user.id, payload);
    user = Object.assign(user, payload);
    return user;
  }
}
