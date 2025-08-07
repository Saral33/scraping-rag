import { FastifyReply, FastifyRequest } from "fastify"
import Services from "../../services"
import CommonUtils from "../../utils/commonUtils"
import { CustomError } from "../../middleware/error/customError"


interface ScrapingRequest {
    // Type anything you want to receive in the body
    url: string
}

class ScrapingController {
    private request: FastifyRequest<{ Body: ScrapingRequest }>
    private reply: FastifyReply
    private services: Services

    constructor(request: FastifyRequest<{ Body: ScrapingRequest }>, reply: FastifyReply) {
        this.request = request
        this.reply = reply
        this.services = new Services()
    }

    async scrapeContent() {
        try {
            const cluster = this.request.cluster
            const { url } = this.request.body
            const isUrlValidAndExists = await CommonUtils.isUrlValidAndExists(url)

            if (!isUrlValidAndExists) {
                throw new CustomError('Invalid URL. Please check the URL and try again.', 400, 'INVALID_URL')
            }

            const scrapingService = await this.services.scrapingService()
            const contentScraped = await scrapingService.scrapeContent(cluster, url)

            const processedHtml = await scrapingService.processHtml(contentScraped, url);
            const markdown = await scrapingService.changeHtmlToMarkdown(processedHtml?.content ?? '')
            const text = (await scrapingService.changeMarkdownToText(markdown))

            return this.reply.send({
                result: text
            })
        }
        catch (error: any) {
            throw new CustomError(error?.message || 'Something went wrong. Please try again.', 500, 'INTERNAL_SERVER_ERROR')
        }


    }
}

export default ScrapingController