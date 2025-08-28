import { env } from "@/config/env";
import { buildApp } from "@/lib/fastify";

const start = async () => {
  let app;

  try {
    app = await buildApp();

    await app.listen({
      port: env.PORT,
      host: env.HOST,
    });

    app.log.info(`Server listening at http://${env.HOST}:${env.PORT}`);

    if (env.NODE_ENV === "development") {
      app.log.info(
        `API docs available at http://localhost:${env.PORT}/api/docs`
      );
    }
  } catch (error) {
    // Se app foi criado, use app.log, senão use console
    if (app) {
      app.log.error(error, "Error starting server");
    } else {
      console.error("Error building app:", error);
    }
    process.exit(1);
  }
};

const gracefulShutdown = async (signal: string) => {
  console.log(`Received ${signal}, shutting down gracefully`);
  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

start();
