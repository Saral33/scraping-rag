import { FastifyInstance, FastifyPluginOptions } from "fastify"
import Controllers from "../../controllers"

async function scrapingRoute(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    const controllers = new Controllers()

    fastify.post('/', (async (req, reply) => (await controllers.scrappingController(req, reply)).scrapeContent()))
    fastify.post('/file', async (req,reply)=> (await controllers.scrappingController(req, reply)).scrapeFile())
}

export default scrapingRoute