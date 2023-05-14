import pg from "pg";
import { InitOptions } from "@typings/system";
import Database from "@db";
import User from "@db/user";
import Token from "@db/token";
import AuthController from "@controllers/auth";
import UserController from "@controllers/user";
import TokenHandler from "@support/token-handler";
import Bottle from "bottlejs";
import ConfigManager from "@config-manager";
import SMTPClient from "@smtp-client";

export default function constructBottle(initOptions: InitOptions): Bottle {
  const {
    smtpConfig,
    logger,
    dbConfig,
    authConfig
  } = initOptions;
  const bottle = new Bottle();
  
  bottle.factory("Logger", () => logger);
  bottle.factory("ConfigManager", () => {
    return new ConfigManager(
      authConfig,
      dbConfig,
      smtpConfig
    );
  });
  bottle.factory("DBClient", () => {
    const connectionPool = new pg.Pool(dbConfig);
    const user =  new User(connectionPool);
    const token = new Token(connectionPool);
    return new Database(connectionPool, {
      User: user,
      Token: token,
    });
  });
  bottle.service("TokenHandler", TokenHandler, "ConfigManager");
  bottle.service("SMTPClient", SMTPClient, "ConfigManager");
  bottle.service("AuthController", AuthController, "SMTPClient", "TokenHandler", "DBClient", "Logger");
  bottle.service("UserController", UserController, "TokenHandler", "Logger", "DBClient");

  return bottle;
}