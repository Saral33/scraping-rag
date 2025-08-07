// src/envSchema.ts
import { FastifyEnvOptions } from '@fastify/env';

export const envSchema: FastifyEnvOptions = {
    schema: {
        type: 'object',
        required: ['PORT', 'OPENAI_API_KEY'],
        properties: {
            PORT: { type: 'string', default: '3000' },
            OPENAI_API_KEY: { type: 'string', default: '' },

        },
    },
    dotenv: true,
};
