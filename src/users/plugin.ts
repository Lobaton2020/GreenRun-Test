import * as Hapi from "@hapi/hapi";
import { UserController } from "./controllers/user.controller";
import { UserRepository } from "./repository/user.repository";
import { OptionsUsersPlugin } from "./models/usersModuleHapi";
import { JWT_STRATEGY } from "../index";
import { adminAccessMiddleware } from "../common/middlewares/roleAccessMiddlewares";
import idValidator from "../common/validators/id.validator";

const register = (server: Hapi.Server, options: OptionsUsersPlugin) => {
  const repository = new UserRepository(options.connection);
  const Controller = new UserController(repository);

  const routes: Hapi.ServerRoute[] = [
    {
      path: "/users/admin/block/{id}",
      method: "PATCH",
      options: {
        handler: Controller.block.bind(Controller),
        tags: ["api"],
        description:
          "This allw to the ADMIN rol block another user, diretent of ADMIN",
        auth: {
          strategy: JWT_STRATEGY,
        },
        pre: [
          {
            method: adminAccessMiddleware,
          },
        ],
        validate: {
          params: idValidator,
        },
      },
    },
    {
      path: "/users",
      method: "GET",
      options: {
        handler: Controller.findAll.bind(Controller),

        auth: {
          strategy: JWT_STRATEGY,
        },
        pre: [
          {
            method: adminAccessMiddleware,
          },
        ],
      },
    },
  ];

  server.route(routes);
};
exports.plugin = {
  register,
  name: "usersModule",
};
