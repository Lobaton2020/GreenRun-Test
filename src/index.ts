require("dotenv").config();

import * as Hapi from "@hapi/hapi";
import * as HapiSwagger from "hapi-swagger";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import knex from "knex";
import config from "./database/knexfile";
import { OptionsUsersPlugin } from "./users/models/usersModuleHapi";
import { v4 as uuidv4 } from "uuid";
//this will be organized on a differente file
export const JWT_STRATEGY = "JWT_STRATEGY";
export const AUD_JWT = "urn:audience:test";
export const ISS_JWT = "urn:issuer:test";
const bootstrap = async function () {
  try {
    const port = process.env.PORT || 3000;
    const server = Hapi.server({ port });
    const optionsCommonPlugins: OptionsUsersPlugin = {
      connection: knex(config[(process.env.NODE_ENV ?? "development").trim()]),
    };
    const registerOptions: Hapi.ServerApplicationState = {
      routes: {
        prefix: "/api/v1",
      },
    };
    const swaggerOptions: HapiSwagger.RegisterOptions = {
      info: {
        title: "Test API HAPI JS",
      },
    };
    const appPluginsModule: Hapi.ServerRegisterPluginObject<any>[] = [
      //swagger generator
      {
        plugin: Inert,
      },
      {
        plugin: Vision,
      },
      {
        plugin: HapiSwagger,
        options: swaggerOptions,
      },
      //users
      {
        plugin: require("./users/plugin"),
        options: optionsCommonPlugins,
      },
      //auth
      {
        plugin: require("./auth/plugin"),
        options: optionsCommonPlugins,
      },
    ];

    await server.register(
      {
        plugin: require("@hapi/jwt"),
      },
      registerOptions
    );
    server.auth.strategy(JWT_STRATEGY, "jwt", {
      keys: process.env.JWT_SECRET_KEY,
      verify: {
        aud: AUD_JWT,
        iss: ISS_JWT,
        sub: false,
        nbf: true,
        exp: true,
      },
      validate: (artifacts: any, request: any, h: any) => {
        return {
          isValid: true,
          credentials: { user: artifacts.decoded.payload },
        };
      },
    });
    await server.register([...appPluginsModule], registerOptions);
    // server.auth.default(JWT_STRATEGY);
    // server.ext("onPreResponse", function (request: any, h) {
    //   request?.response?.header("x-request-id", uuidv4());
    //   return h.continue;
    // });
    await server.start();
    console.log("Server running on port:" + port);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

bootstrap().catch(console.error);
