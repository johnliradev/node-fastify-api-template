import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export const Router = (app: FastifyInstance) => {
  app.get(
    "/health",
    {
      schema: {
        description: "Health check endpoint",
        tags: ["Health"],
        response: {
          200: {
            type: "object",
            properties: {
              status: { type: "string" },
              timestamp: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    (request: FastifyRequest, reply: FastifyReply) =>
      reply.send({ status: "ok", timestamp: new Date().toISOString() })
  );
};
