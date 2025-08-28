import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "./appError";
import { time } from "console";
import { env } from "@/config/env";

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { method, url } = request;
  request.log.error(
    {
      error: {
        error: error.message,
        stack: error.stack,
        code: error.code,
      },
      request: {
        method,
        url,
        params: request.params,
        query: request.query,
        ip: request.ip,
      },
    },
    "Request error"
  );
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: {
        message: error.message,
        statusCode: error.statusCode,
        code: error.code,
      },
      time: new Date().toISOString(),
    });
  }
  if (error.validation) {
    return reply.status(400).send({
      error: {
        message: "Validation error",
        code: "VALIDATION_ERROR",
        statusCode: 400,
        details: error.validation,
      },
      timestamp: new Date().toISOString(),
    });
  }
  const statusCode = error.statusCode ? error.statusCode : 500;
  return reply.status(statusCode).send({
    error: {
      message:
        env.NODE_ENV === "production"
          ? getGenericMessage(statusCode)
          : error.message,
      code: getErrorCode(statusCode),
      statusCode,
    },
    timestamp: new Date().toISOString(),
  });
  function getGenericMessage(statusCode: number): string {
    switch (statusCode) {
      case 404:
        return "Not Found";
      case 400:
        return "Bad Request";
      case 401:
        return "Unauthorized";
      case 403:
        return "Forbidden";
      case 500:
        return "Internal Server Error";
      default:
        return "An error occurred";
    }
  }
  function getErrorCode(statusCode: number): string {
    switch (statusCode) {
      case 404:
        return "NOT_FOUND";
      case 400:
        return "BAD_REQUEST";
      case 401:
        return "UNAUTHORIZED";
      case 403:
        return "FORBIDDEN";
      case 500:
        return "INTERNAL_ERROR";
      default:
        return "UNKNOWN_ERROR";
    }
  }
};
