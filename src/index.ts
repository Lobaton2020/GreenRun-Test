require("dotenv").config();

import * as Hapi from "@hapi/hapi";
import * as HapiSwagger from "hapi-swagger";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import knex from "knex";
import config from "./database/knexfile";
import { OptionsUsersPlugin } from "./users/models/usersModuleHapi";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { HapiRequest } from "./common/middlewares/roleAccessMiddlewares";
//this will be organized on a differente file
export const JWT_STRATEGY = "JWT_STRATEGY";
export const AUD_JWT = "urn:audience:test";
export const ISS_JWT = "urn:issuer:test";
const bootstrap = async function () {
  try {
    const port = process.env.PORT || 3000;
    const server = Hapi.server({
      port,
      routes: {
        files: {
          relativeTo: path.join(__dirname, "../docs"),
        },
        cors: true,
      },
    });
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
        description: `This is the api to fix the requierements you can access <a href="/public/GreenRun - Backend Developer Test.pdf">Here</a> <br> You can access to the Model Relational Diagram <a href="/public/MER.png">Here</a>
          <h4>** ALERT: When you got the token and you are going to add in swagger please add the prefix Bearer</h4>`,
      },
      sortEndpoints: "ordered",
      grouping: "tags",
      securityDefinitions: {
        JWT: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
          keyPrefix: "Bearer ",
        },
      },
      security: [{ JWT: [] }],
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
      //trasactions
      {
        plugin: require("./transactions/plugin"),
        options: optionsCommonPlugins,
      },
      // bets
      {
        plugin: require("./bets/plugin"),
        options: optionsCommonPlugins,
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
    // default routes to ser static files and documentation

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
    //redirect to tht docs
    server.route({
      path: "/",
      method: "GET",
      options: {
        handler(req: HapiRequest, res: Hapi.ResponseToolkit) {
          return res.redirect("/api/v1/documentation");
        },
      },
    });
    //serlve files statics
    server.route({
      path: "/public/{param*}",
      method: "GET",
      handler: {
        directory: {
          path: "../docs",
          redirectToSlash: true,
          index: true,
        },
      },
    });
    await server.start();
    console.log("Server running on port:" + port);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

bootstrap().catch(console.error);
