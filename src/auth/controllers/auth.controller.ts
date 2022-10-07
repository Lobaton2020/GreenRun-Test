import { LoginPayload } from "../../auth/models/auth.mode";
import * as Hapi from "@hapi/hapi";
import { User } from "../../users/models/user.model";
import { UserRepository } from "../../users/repository/user.repository";
import { UserRole } from "../../database/migrations/20221005222240_app-migration";
import bcrypt from "bcrypt";
import * as Boom from "@hapi/boom";
import jwt from "jsonwebtoken";
import { AUD_JWT, ISS_JWT } from "../..";
export class AuthController {
  constructor(readonly userRepository: UserRepository) {}
  async registerAdmin(req: Hapi.Request) {
    const user: User = req.payload as User;
    user.role = UserRole.ADMIN;
    user.password = await bcrypt.hash(user.password, 15);
    return await this.userRepository.create(user);
  }

  async registerUser(req: Hapi.Request) {
    const user: User = req.payload as User;
    user.role = UserRole.USER;
    user.password = await bcrypt.hash(user.password, 15);
    return await this.userRepository.create(user);
  }

  async login(req: Hapi.Request) {
    const payload: LoginPayload = req.payload as LoginPayload;
    const user: User | undefined = await this.userRepository.findByEmail(
      payload.email
    );
    if (!user) {
      return Boom.badRequest("Bad credentials");
    }
    if (!(await bcrypt.compare(payload.password, user.password))) {
      return Boom.badRequest("Bad credentials");
    }
    const token = await jwt.sign(
      {
        sub: user.id,
        role: user.role,
        email: user.email,
        fullname: user.first_name + " " + user.last_name,
        username: user.username,
        aud: AUD_JWT,
        iss: ISS_JWT,
      },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: `${process.env.JWT_TIME_EXPIRATION_HOURS || 1}h` }
    );
    return { accessToken: token };
  }
}
