import { FastifyInstance, FastifyPluginOptions } from "fastify";
import scrapingRoute from "./scraping/route";


async function routes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    fastify.register(scrapingRoute, { prefix: '/api/scraping' })
}

export default routes