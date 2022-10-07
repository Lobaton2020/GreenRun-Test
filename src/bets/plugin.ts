import * as Hapi from "@hapi/hapi";
import { OptionsUsersPlugin } from "../users/models/usersModuleHapi";
import { ExceptionDecorator } from "../common/decorators/exception.decorator";
import { EventRepository } from "./repositories/event.repository";
import { SportRepository } from "./repositories/sport.repository";
import { BetRepository } from "./repositories/bet.repository";
import { BetController } from "./controllers/bet.controller";
import { JWT_STRATEGY } from "..";
import { UserAndAdminAcccessMiddleware } from "../common/middlewares/roleAccessMiddlewares";

const register = (server: Hapi.Server, options: OptionsUsersPlugin) => {
  const betRepository = new BetRepository(options.connection);
  const sportRepository = new SportRepository(options.connection);
  const eventRepository = new EventRepository(options.connection);
  const Controller = new BetController(
    betRepository,
    sportRepository,
    eventRepository
  );
  const security = {
    auth: {
      strategy: JWT_STRATEGY,
    },
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
        ...security,
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
        ...security,
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
        ...security,
      },
    },
  ];
  server.route(routes);
};
exports.plugin = {
  register,
  name: "betsModule",
};
