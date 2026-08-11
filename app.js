import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
import express from "express"; 
import cors from "cors";

config();

const app = express();


const port = process.env.PORT || 3000;

app.use(express.json());


app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.TOKEN);

app.post('/chat', async (req, res) => {
    const dataInicial = new Date();
    
    try {
        const { texto, agr } = req.body; 

        if (!texto) {
            return res.status(400).json({ message: "texto obrigatorio" });
        }

        const model = genAI.getGenerativeModel({
            model: process.env.MODEL || "gemini-1.5-flash",
       
            generationConfig: { 
                thinkingConfig: {
                    thinkingBudget: 0
                }
            },
            
            systemInstruction: `Sua única e exclusiva função é corrigir textos em português. 
            Você receberá um texto com erros e deve retornar APENAS o texto corrigido de forma ${agr || 'neutra'}. 
            Não adicione absolutamente nada antes ou depois do texto corrigido. Não use saudações, 
            explicações, comentários ou formatação Markdown.`
        });

        const result = await model.generateContent(texto);
        
       
        const responseText = result.response.text();

        const datafinal = new Date();
        const tempo = datafinal - dataInicial;
        console.log(`Resposta gerada em ${tempo}ms`);

        return res.json({ msg: responseText });

    } catch (error) {
        console.error("erro no endpoint", error);
        return res.status(500).json({ error: "erro no lado do servidor" });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});