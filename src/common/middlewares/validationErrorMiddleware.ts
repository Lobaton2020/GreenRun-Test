import * as Boom from "@hapi/boom";

export const validationErrorMiddleware: any = (
  request: any,
  reply: any,
  source: any,
  error: any
): any => {
  console.error("[Validation-Error]", error, `${source}`);
  return Boom.badRequest("Error to validate your request");
};

export const validationJoiError = () => {};
