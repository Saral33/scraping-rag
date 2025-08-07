import { FastifyRequest } from 'fastify'
import { getCluster } from '../cluster'

declare module 'fastify' {
    interface FastifyRequest {
        cluster: ReturnType<typeof getCluster>
    }
}