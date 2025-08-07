import { FastifyReply, FastifyRequest, } from "fastify";
import ScrapingController from "./scraping";


class Controllers {

    async scrappingController(request: FastifyRequest, reply: FastifyReply) {
        return new ScrapingController(request, reply)
    }
};

export default Controllers