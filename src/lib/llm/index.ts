import { GoogleGenAI } from "@google/genai"
import { geminiConfig } from "../../config/gemini.config"
import GeminiConstant from "../constant/gemini.constant";

const ai = new GoogleGenAI({
    apiKey : geminiConfig.GEMINI_API_KEY,
})

type TaskType = "RETRIEVAL_QUERY" | "RETRIEVAL_DOCUMENT" | "FACT_VERIFICATION";

namespace Gemini {

    export const embeddingContent = async (contents: string[] | string, taskType :TaskType = 'RETRIEVAL_DOCUMENT', model = GeminiConstant.EMBEDDING_MODEL) => await ai.models.embedContent({
        model: model,
        contents: contents,
        config :{
            outputDimensionality : 1536,
            taskType : taskType,
        }
    })

    export const generateContent = async (contents: any, model: string = GeminiConstant.COMMON_MODEL) =>
        await ai.models.generateContent({
        model: model,
        contents: contents,
    })

    export const generateChat = (model: string = GeminiConstant.COMMON_MODEL) =>
         ai.chats.create({
            model: model,
            config : {
                temperature: 0.5,
            },
    })

}

export default Gemini;