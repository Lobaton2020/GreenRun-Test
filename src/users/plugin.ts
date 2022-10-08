import * as Hapi from "@hapi/hapi";
import { UserController } from "./controllers/user.controller";
import { UserRepository } from "./repository/user.repository";
import { OptionsUsersPlugin } from "./models/usersModuleHapi";
import { JWT_STRATEGY } from "../index";
import {
  adminAccessMiddleware,
  userAccessMiddleware,
  UserAndAdminAcccessMiddleware,
} from "../common/middlewares/roleAccessMiddlewares";
import idValidator from "../common/validators/id.validator";
import { ExceptionDecorator } from "../common/decorators/exception.decorator";
import registerValidator from "../auth/validators/register.validator";
import updateUserValidator from "./validators/updateUser.validator";
import { validationErrorMiddleware } from "../common/middlewares/validationErrorMiddleware";

const register = (server: Hapi.Server, options: OptionsUsersPlugin) => {
  const repository = new UserRepository(options.connection);
  const Controller = new UserController(repository);
  const securityStrategy = {
    auth: {
      strategy: JWT_STRATEGY,
    },
  };
  const securityAdmin = {
    ...securityStrategy,
    pre: [
      {
        method: adminAccessMiddleware,
      },
    ],
  };
  const securityUser = {
    ...securityStrategy,
    pre: [
      {
        method: userAccessMiddleware,
      },
    ],
  };
  const securityUserAndAdmin = {
    ...securityStrategy,
    pre: [
      {
        method: UserAndAdminAcccessMiddleware,
      },
    ],
  };
  const routes: Hapi.ServerRoute[] = [
    {
      path: "/users/block/{id}",
      method: "PATCH",
      options: {
        handler: ExceptionDecorator(Controller.block.bind(Controller)),
        tags: ["api", "users"],
        description:
          "This allow to the ADMIN rol block another user, diretent of ADMIN",
        ...securityAdmin,
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
        ...securityAdmin,
      },
    },
    {
      path: "/users/{id}",
      method: "PUT",
      options: {
        handler: ExceptionDecorator(Controller.update.bind(Controller)),
        tags: ["api", "users"],
        description: "This allow to the ADMIN  update data of one user",
        ...securityAdmin,
        validate: {
          payload: updateUserValidator,
          params: idValidator,
          failAction: validationErrorMiddleware,
        },
      },
    },
    {
      path: "/users/profile",
      method: "PUT",
      options: {
        handler: ExceptionDecorator(Controller.updateProfile.bind(Controller)),
        tags: ["api", "users"],
        description: "This allow to the ADMIN  update data of one user",
        ...securityUserAndAdmin,
        validate: {
          payload: updateUserValidator,
          failAction: validationErrorMiddleware,
        },
      },
    },
  ];

  server.route(routes);
};
exports.plugin = {
  register,
  name: "usersModule",
};
