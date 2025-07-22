
import { GoogleGenerativeAI } from "@google/generative-ai"
import { config} from "dotenv";
import  express, { response }  from "express"
import  cors  from "cors"
config()
const app = express()
const port = 3000
app.use(express.json());
app.use(cors())
const genAI = new GoogleGenerativeAI (process.env.TOKEN)

app.post('/chat', async (req, res) => {
  try{
    const {texto} = req.body
    const {agr} = req.body
    if (!texto) {
      return res.status(400).json({message: "texto obrigatorio"})
    }
    console.log(texto)
    console.log(agr)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
     systemInstruction: `Sua única e exclusiva função é corrigir textos em português. 
     Você receberá um texto com erros e deve retornar APENAS o texto corrigido de forma ${agr}. 
     Não adicione absolutamente nada antes ou depois do texto corrigido. Não use saudações, 
     explicações, comentários ou formatação Markdown`
    })
    const result = await model.generateContent(texto)
    
    const response =  result.response
    const respottext = response.text()
    res.json({msg: respottext})
    console.log(respottext)
  }
  catch (error){
    console.error("erro no endpoint", error)
    res.status(500).json({error: "erro no lado do servidor"})
    }
  })
  
  app.listen(port ,() =>{
    console.log(`Servidor rodando em http://localhost:${port}`)
  })

  