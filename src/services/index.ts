import ScrapingService from "./scraping"

class Services {
    private scrapingServices: ScrapingService

    constructor() {
        this.scrapingServices = new ScrapingService()
    }

    async scrapingService() {
        return this.scrapingServices
    }
}

export default Services