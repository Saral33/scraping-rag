import { FastifyReply, FastifyRequest } from "fastify"
import Services from "../../services"
import CommonUtils from "../../utils/commonUtils"
import { CustomError } from "../../middleware/error/customError"
import pdf from 'pdf-parse';
import mammoth from 'mammoth';


interface ScrapingRequest {
    // Type anything you want to receive in the body
    url: string
}
interface FileUploadRequest {
    file: () => Promise<{
        fieldname: string;
        filename: string;
        encoding: string;
        mimetype: string;
        file: AsyncIterable<Buffer>;
        fields: Record<string, unknown>;
    }>;
}

class ScrapingController {
    private request: FastifyRequest<{ Body: ScrapingRequest }> & FileUploadRequest
    private reply: FastifyReply
    private services: Services

    constructor(request: FastifyRequest<{ Body: ScrapingRequest }> & FileUploadRequest, reply: FastifyReply) {
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
    async scrapeFile() {
        const file = await this.request.file()
        if (!file) {
            throw new CustomError('No file uploaded. Please upload a file.', 400, 'NO_FILE_UPLOADED')
        }
      const chunks: Buffer[] = [];
       for await (const chunk of file?.file) {
            chunks.push(chunk as Buffer);
        }
      const fileBuffer = Buffer.concat(chunks);
       let extractedText = '';
        const mimetype = file.mimetype.toLowerCase();
        const filename = file.filename.toLowerCase();
         try {
            if (mimetype === 'text/plain' || filename.endsWith('.txt')) {
                // Plain text file
                extractedText = fileBuffer.toString('utf-8');
            } 
            else if (mimetype === 'application/pdf' || filename.endsWith('.pdf')) {
                // PDF file
                const pdfData = await pdf(fileBuffer);
                extractedText = pdfData.text;
            } 
            else if (
                mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                filename.endsWith('.docx')
            ) {
                // DOCX file
                const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
                extractedText = value;
            } 
            else {
                // Unsupported format
                return this.reply.status(415).send({
                    error: 'Unsupported file type for text extraction',
                    mimetype,
                    size: fileBuffer.length
                });
            }

            return {
                filename: file?.filename,    
                mimetype,
                result: extractedText?.trim()
            };
        } catch (err:any) {
           console.error('Error extracting file contents:', err?.message || err);
            return this.reply.status(500).send({ error: 'Error extracting file contents', details: err?.message || err });
        }
    }
}

export default ScrapingController