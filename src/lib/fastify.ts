import fastify from "fastify";
import { registerPlugins } from "./plugins";
import { errorHandler } from "@/http/errors/error-handler";
import { env } from "@/config/env";

export const app = fastify({
  logger: {
    level: env.NODE_ENV === "production" ? "info" : "debug",
    transport:
      env.NODE_ENV === "development"
        ? {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "SYS:standard",
              ignore: "pid,hostname",
            },
          }
        : undefined,
  },
  disableRequestLogging: env.NODE_ENV === "production",
  trustProxy: env.NODE_ENV === "production",
});

export async function buildApp() {
  try {
    app.setErrorHandler(errorHandler);
    await registerPlugins(app);
    await app.ready();
    return app;
  } catch (error) {
    app.log.error(error, "Error building Fastify app");
    throw error;
  }
}
