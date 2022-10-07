import * as Boom from "@hapi/boom";
import * as Hapi from "@hapi/hapi";

export const ExceptionDecorator = (handler: Hapi.Lifecycle.Method) => {
  return async (req: Hapi.Request, reply: Hapi.ResponseToolkit) => {
    try {
      return await handler(req, reply);
    } catch (err) {
      console.log("[Error]", err);
      throw Boom.serverUnavailable("Internal server error");
    }
  };
};
