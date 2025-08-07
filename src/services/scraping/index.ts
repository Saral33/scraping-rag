import { Cluster } from "puppeteer-cluster"
import { CustomError } from "../../middleware/error/customError"
import { Page } from "puppeteer"
import { JSDOM } from "jsdom"
import { Readability } from "@mozilla/readability"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { cleanMarkdownPrompt } from "../../prompts/scrapePrompts"
import { ChatOpenAI } from "@langchain/openai"
import llm from "../../config/llmConfig"
import TurnDownService from "turndown"
import removeMd from "remove-markdown"


class ScrapingService {
    private llm: ChatOpenAI
    turnDown: TurnDownService

    constructor() {
        this.llm = llm
        this.turnDown = new TurnDownService()
    }

    async scrapeContent(cluster: Cluster, url: string) {
        try {
            const scrapedData = await cluster?.execute(url, async (data) => {
                const { page } = data
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 })
                await this.handlePopUps(page)
                await this.removeUnwantedElements(page)

                const contentHTML = await page.evaluate(() => {
                    const selectors = ['main', 'article', 'section'];
                    for (const selector of selectors) {
                        const el = document.querySelector(selector);
                        if (el && el.innerHTML.trim().length > 100) {
                            return el.outerHTML;
                        }
                    }
                    return document.body.outerHTML;
                });

                const cleanContent = contentHTML?.replace(/\n/g, '').replace(/\s{2,}/g, ' ');
                await page.close()
                return cleanContent
            })
            return scrapedData
        }
        catch (error: any) {
            throw new CustomError(error?.message || 'Something went wrong. Please try again.', 500, 'INTERNAL_SERVER_ERROR')
        }
    }

    async handlePopUps(page: Page) {
        const popupSelectors = [
            '[class*="modal"]',
            '[class*="popup"]',
            '[class*="overlay"]',
            '[id*="modal"]',
            '[id*="popup"]',
            '.cookie-banner',
            '#cookie-banner',
            '[class*="cookie"]',
            '[aria-label*="close"]',
            '[aria-label*="dismiss"]',
            '[class*="banner"]',

        ];

        for (const selector of popupSelectors) {
            try {
                await page.evaluate((sel) => {
                    const elements = document.querySelectorAll(sel);
                    elements.forEach(el => {
                        if (el instanceof HTMLElement) el.style.display = 'none';
                    });
                }, selector);
            } catch (e) {
                console.log('error', e)
            }
        }

    }

    async removeUnwantedElements(page: Page) {

        await page.evaluate(() => {
            const selectors = [
                'footer', '#footer',
                'nav', 'aside',
                '#cookie-banner', '.cookie-banner',
                '[role="banner"]',
                '[aria-label*="breadcrumb"]'

            ];

            selectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => el.remove());
            });


            // Remove empty elements
            document.querySelectorAll('*').forEach(el => {
                const isEmpty =
                    el.childElementCount === 0 &&
                    el.textContent?.trim() === '' &&
                    el.querySelectorAll('img, video, input, iframe').length === 0;

                if (isEmpty && el instanceof HTMLElement) {
                    el.remove();
                }
            });
        });
    }

    async processHtml(html: string, url: string) {
        const dom = new JSDOM(html, { url })
        const reader = new Readability(dom.window.document)
        const article = reader.parse()
        return article
    }

    async changeHtmlToMarkdown(html: string) {
        if (!html) return ''
        this.turnDown.addRule('customLink', {
            filter: 'a',
            replacement: function (content: string, node: HTMLElement) {
                const anchor = node as HTMLAnchorElement;
                const href = anchor.href;
                return `${content} (${href})`;
            }
        });
        const markdown = this.turnDown.turndown(html)
        return markdown
    }

    async changeMarkdownToText(markdown: string) {
        if (!markdown) return ''
        const text = removeMd(markdown)
        return text
    }

    async cleanMarkdown(markdown: string): Promise<string> {
        if (!markdown) return ''
        const systemMessage = new SystemMessage(cleanMarkdownPrompt)
        const humanMessage = new HumanMessage(`Clean this HTML:\n\n${markdown}`);
        const result = await this.llm.invoke([systemMessage, humanMessage])
        const content = result?.content as string
        return content ?? markdown
    }
}

export default ScrapingService