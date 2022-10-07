import * as Hapi from "@hapi/hapi";
import { UserController } from "./controllers/user.controller";
import { UserRepository } from "./repository/user.repository";
import { OptionsUsersPlugin } from "./models/usersModuleHapi";
import { JWT_STRATEGY } from "../index";
import { adminAccessMiddleware } from "../common/middlewares/roleAccessMiddlewares";
import idValidator from "../common/validators/id.validator";
import { ExceptionDecorator } from "../common/decorators/exception.decorator";

const register = (server: Hapi.Server, options: OptionsUsersPlugin) => {
  const repository = new UserRepository(options.connection);
  const Controller = new UserController(repository);
  const security = {
    auth: {
      strategy: JWT_STRATEGY,
    },
    pre: [
      {
        method: adminAccessMiddleware,
      },
    ],
  };
  const routes: Hapi.ServerRoute[] = [
    {
      path: "/users/admin/block/{id}",
      method: "PATCH",
      options: {
        handler: ExceptionDecorator(Controller.block.bind(Controller)),
        tags: ["api", "users"],
        description:
          "This allw to the ADMIN rol block another user, diretent of ADMIN",
        ...security,
        validate: {
          params: idValidator,
        },
      },
    },
    {
      path: "/users",
      method: "GET",
      options: {
        handler: ExceptionDecorator(Controller.findAll.bind(Controller)),
        ...security,
      },
    },
  ];

  server.route(routes);
};
exports.plugin = {
  register,
  name: "usersModule",
};
