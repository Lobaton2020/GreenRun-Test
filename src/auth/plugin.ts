import * as Hapi from "@hapi/hapi";
import { AuthController } from "./controllers/auth.controller";
import { UserRepository } from "../users/repository/user.repository";
import { OptionsUsersPlugin } from "../users/models/usersModuleHapi";
import registerValidator from "./validators/register.validator";
import loginValidator from "./validators/login.validator";
import { ExceptionDecorator } from "../common/decorators/exception.decorator";
import { validationErrorMiddleware } from "../common/middlewares/validationErrorMiddleware";

const register = (server: Hapi.Server, options: OptionsUsersPlugin) => {
  const repository = new UserRepository(options.connection);
  const Controller = new AuthController(repository);

  const routes: Hapi.ServerRoute[] = [
    {
      path: "/auth/register/admin",
      method: "POST",
      options: {
        handler: ExceptionDecorator(Controller.registerAdmin.bind(Controller)),
        tags: ["api", "auth"],
        description:
          "The register of the admin role user is done using this endpoint",
        validate: {
          payload: registerValidator,
          failAction: validationErrorMiddleware,
        },
        response: {
          failAction: validationErrorMiddleware,
        },
      },
    },
    {
      path: "/auth/register/user",
      method: "POST",
      options: {
        handler: ExceptionDecorator(Controller.registerUser.bind(Controller)),
        tags: ["api", "auth"],
        description:
          "The register of the user role user is done using this endpoint",
        validate: {
          payload: registerValidator,
          failAction: validationErrorMiddleware,
        },
        response: {
          failAction: validationErrorMiddleware,
        },
      },
    },
    {
      path: "/auth/login",
      method: "POST",
      options: {
        handler: ExceptionDecorator(Controller.login.bind(Controller)),
        tags: ["api", "auth"],
        description: "The user will be logged trhought this endpoint",
        validate: {
          payload: loginValidator,
          failAction: validationErrorMiddleware,
        },
        response: {
          failAction: validationErrorMiddleware,
        },
      },
    },
  ];
  server.route(routes);
};
exports.plugin = {
  register,
  name: "authModule",
};
