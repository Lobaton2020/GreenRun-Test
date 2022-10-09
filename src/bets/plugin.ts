import * as Hapi from "@hapi/hapi";
import { OptionsUsersPlugin } from "../users/models/usersModuleHapi";
import { ExceptionDecorator } from "../common/decorators/exception.decorator";
import { EventRepository } from "./repositories/event.repository";
import { SportRepository } from "./repositories/sport.repository";
import { BetRepository } from "./repositories/bet.repository";
import { BetController } from "./controllers/bet.controller";
import { JWT_STRATEGY } from "..";
import {
  adminAccessMiddleware,
  userAccessMiddleware,
  UserAndAdminAcccessMiddleware,
} from "../common/middlewares/roleAccessMiddlewares";
import { TransactionsRepository } from "../transactions/repositories/transaction.respository";
import { UserBetRepository } from "./repositories/user-bets.repostitory";

const register = (server: Hapi.Server, options: OptionsUsersPlugin) => {
  const betRepository = new BetRepository(options.connection);
  const sportRepository = new SportRepository(options.connection);
  const eventRepository = new EventRepository(options.connection);
  const userBetRepository = new UserBetRepository(options.connection);
  const transactionRepository = new TransactionsRepository(options.connection);
  const Controller = new BetController(
    betRepository,
    sportRepository,
    eventRepository,
    userBetRepository,
    transactionRepository
  );
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
      path: "/bets",
      method: "GET",
      options: {
        handler: ExceptionDecorator(Controller.findAll.bind(Controller)),
        tags: ["api", "bets"],
        description:
          "Throw this controller the any user logged in can get the BETS",
        ...securityUserAndAdmin,
      },
    },
    {
      path: "/bets/events",
      method: "GET",
      options: {
        handler: ExceptionDecorator(Controller.findAllEvents.bind(Controller)),
        tags: ["api", "bets"],
        description:
          "Throw this controller the any user logged in can get the EVENTS",
        ...securityUserAndAdmin,
      },
    },
    {
      path: "/bets/sports",
      method: "GET",
      options: {
        handler: ExceptionDecorator(Controller.findAllSports.bind(Controller)),
        tags: ["api", "bets"],
        description:
          "Throw this controller the any user logged in can get the SPORTS",
        ...securityUserAndAdmin,
      },
    },
    {
      path: "/bets",
      method: "POST",
      options: {
        handler: ExceptionDecorator(Controller.place.bind(Controller)),
        tags: ["api", "bets"],
        description: "User place a bet",
        ...securityUser,
      },
    },
  ];
  server.route(routes);
};
exports.plugin = {
  register,
  name: "betsModule",
};
