import * as Hapi from "@hapi/hapi";
import { JWT_STRATEGY } from "../index";
import {
  adminAccessMiddleware,
  userAccessMiddleware,
  UserAndAdminAcccessMiddleware,
} from "../common/middlewares/roleAccessMiddlewares";
import idValidator from "../common/validators/id.validator";
import { TransactionsRepository } from "./repositories/transaction.respository";
import { TransactionController } from "./controllers/transaction.controller";
import { OptionsUsersPlugin } from "../users/models/usersModuleHapi";
import {
  transactionDepositValidator,
  transactionWithdrawValidator,
} from "./validators/createDeposit.validator";
import { validationErrorMiddleware } from "../common/middlewares/validationErrorMiddleware";
import { ExceptionDecorator } from "../common/decorators/exception.decorator";

const register = (server: Hapi.Server, options: OptionsUsersPlugin) => {
  const repository = new TransactionsRepository(options.connection);
  const Controller = new TransactionController(repository);
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
      path: "/transactions",
      method: "GET",
      options: {
        handler: ExceptionDecorator(Controller.findAll.bind(Controller)),
        tags: ["api", "users"],
        description: "This allow Get all the transactions",
        ...securityUserAndAdmin,
      },
    },
    {
      path: "/transactions/deposit",
      method: "POST",
      options: {
        handler: ExceptionDecorator(Controller.createDeposit.bind(Controller)),
        tags: ["api", "users"],
        validate: {
          payload: transactionDepositValidator,
          failAction: validationErrorMiddleware,
        },
        description: "This allow Get all the transactions",
        ...securityUser,
      },
    },

    {
      path: "/transactions/withdraw",
      method: "POST",
      options: {
        handler: ExceptionDecorator(Controller.createWithdraw.bind(Controller)),
        tags: ["api", "users"],
        validate: {
          payload: transactionWithdrawValidator,
          failAction: validationErrorMiddleware,
        },
        description: "This allow Get all the transactions",
        ...securityUser,
      },
    },
  ];

  server.route(routes);
};
exports.plugin = {
  register,
  name: "transactionsModule",
};
