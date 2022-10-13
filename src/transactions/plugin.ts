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
import { queryCategoryTransaction } from "./validators/queryCategoryTransaction.validator";
import { UserRepository } from "../users/repository/user.repository";

const register = (server: Hapi.Server, options: OptionsUsersPlugin) => {
  const repository = new TransactionsRepository(options.connection);
  const userRepository = new UserRepository(options.connection);
  const Controller = new TransactionController(repository, userRepository);
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
        tags: ["api", "transactions"],
        description: "This endpoint allows the ADMIN get all the transactions",
        validate: {
          query: queryCategoryTransaction,
          failAction: validationErrorMiddleware,
        },
        ...securityUserAndAdmin,
      },
    },
    {
      path: "/transactions/{id}",
      method: "GET",
      options: {
        handler: ExceptionDecorator(Controller.findOne.bind(Controller)),
        tags: ["api", "transactions"],
        description: "This endpoint allows the ADMIN get a transaction by id",
        validate: {
          query: queryCategoryTransaction,
          params: idValidator,
          failAction: validationErrorMiddleware,
        },
        ...securityAdmin,
      },
    },
    {
      path: "/transactions/deposit",
      method: "POST",
      options: {
        handler: ExceptionDecorator(Controller.createDeposit.bind(Controller)),
        tags: ["api", "transactions"],
        validate: {
          payload: transactionDepositValidator,
          failAction: validationErrorMiddleware,
        },
        description:
          "This endpoint allows the USER create a transaction type deposit",
        ...securityUser,
      },
    },

    {
      path: "/transactions/withdraw",
      method: "POST",
      options: {
        handler: ExceptionDecorator(Controller.createWithdraw.bind(Controller)),
        tags: ["api", "transactions"],
        validate: {
          payload: transactionWithdrawValidator,
          failAction: validationErrorMiddleware,
        },
        description:
          "This endpoint allows the USER create a transaction type withdraw",
        ...securityUser,
      },
    },
    {
      path: "/transactions/balances/users/{id}",
      method: "GET",
      options: {
        handler: ExceptionDecorator(Controller.getUserBalance.bind(Controller)),
        tags: ["api", "transactions"],
        validate: {
          params: idValidator,
          failAction: validationErrorMiddleware,
        },
        description:
          "This endpoint allows the ADMIN get the balance of a user by id",

        ...securityAdmin,
      },
    },
    {
      path: "/transactions/balances/users/me",
      method: "GET",
      options: {
        handler: ExceptionDecorator(Controller.getUserBalance.bind(Controller)),
        tags: ["api", "transactions"],
        validate: {
          failAction: validationErrorMiddleware,
        },
        description: "This endpoint allows the USER get him/her self balance",

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
