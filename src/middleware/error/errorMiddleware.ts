import { CustomError } from "./customError";
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";

const errorHandler: FastifyPluginAsync = async (fastify, opts) => {
    fastify.setErrorHandler((error: Error | CustomError, request, reply) => {
        if (error instanceof CustomError) {
            return reply.status(error.statusCode || 500).send({
                status: error.status || 'error',
                message: error.message || 'Something went wrong!',
                code: error.code ?? undefined,
            });
        }

        // Handle unexpected errors
        return reply.status(500).send({
            status: 'error',
            message: 'Internal server error',
        });
    });
};

export default errorHandler