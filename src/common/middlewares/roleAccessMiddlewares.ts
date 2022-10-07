import * as Boom from "@hapi/boom";
import * as Hapi from "@hapi/hapi";
import { UserRole } from "../../database/migrations/20221005222240_app-migration";
import { User } from "../../users/models/user.model";
type HapiRequest = Hapi.Request & any;

const rolMiddleware = (req: HapiRequest, user: User, userRole: string) => {
  if (!user) {
    return Boom.unauthorized("User doesn't find");
  }
  if (!user.role.includes(userRole)) {
    return Boom.unauthorized(
      "You role " + userRole + " doen't have access to this resource"
    );
  }
  req.user = user;
  return user;
};
/**
 * When the user with ADMIN role have access to the same resource
 * @param req
 * @returns
 */
export const adminAccessMiddleware = (
  req: HapiRequest
): Hapi.RouteOptionsPreAllOptions | any => {
  const user = req.auth.credentials.user;
  return rolMiddleware(req, user, UserRole.ADMIN);
};

/**
 * When the user with USER role have access to the same resource
 * @param req
 * @returns
 */
export const userAccessMiddleware = (
  req: HapiRequest
): Hapi.RouteOptionsPreAllOptions | any => {
  const user = req.auth.credentials.user;
  return rolMiddleware(req, user, UserRole.USER);
};

/**
 * When the user with both roles have access to the same resource
 * @param req
 * @returns
 */
export const UserAndAdminAcccessMiddleware = (
  req: HapiRequest
): Hapi.RouteOptionsPreAllOptions | Boom.Boom => {
  const user = req.auth.credentials.user;

  if (!user) {
    return Boom.unauthorized("User doesn't find");
  }
  if (!Object.values(UserRole).some((role) => role.includes(user.role))) {
    return Boom.unauthorized(
      "You role " + user.role + " doen't have access to this resource"
    );
  }
  req.user = user;
  return user;
};
