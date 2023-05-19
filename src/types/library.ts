import { PoolConfig } from "pg";
import { Logger } from "winston";
import { SMTPClientConfig } from "@typings/smtp";
import { AuthConfig } from "@typings/auth";

export type InitOptions = {
  smtpConfig: SMTPClientConfig;
  authConfig: AuthConfig;
  dbConfig: PoolConfig;
  logger: Logger;
}