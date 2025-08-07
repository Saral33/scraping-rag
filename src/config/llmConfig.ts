import { ChatOpenAI } from '@langchain/openai';



const llm = new ChatOpenAI({
    model: 'gpt-4o',
    temperature: 0.3,
    openAIApiKey: process.env.OPENAI_API_KEY || ''
})

export default llm