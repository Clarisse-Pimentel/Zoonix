import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '../db.js';

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

router.post('/', async (req, res) => {
    try {
        const { pergunta } = req.body;

        // 1. O CONTEXTO: Ensinamos a estrutura exata do seu banco de dados
        const promptSQL = `
            Você é um assistente da clínica veterinária Zoonix.
            Aqui está a estrutura real do nosso banco de dados relacional MySQL:
            
            - Tabela 'pacientes' (id, nome, raca, especie, sexo, idade, tutor, telefone_tutor)
            - Tabela 'funcionarios' (id, nome, cpf, cargo, telefone, email, senha)
            - Tabela 'veterinarios' (id_funcionarios, crmv, especialidade) - Obs: id_funcionarios é FK para funcionarios(id)
            - Tabela 'administradores' (id_funcionarios) - Obs: id_funcionarios é FK para funcionarios(id)
            - Tabela 'atendimentos' (id, id_pacientes, id_funcionarios, id_veterinario, data, tratamento, diagnostico) - Obs: id_pacientes referencia pacientes(id), e id_veterinario referencia veterinarios(id_funcionarios)
            - Tabela 'log_exclusoes' (id, tabela_afetada, id_registro, data_hora, id_funcionario_responsavel)
            
            O usuário perguntou: "${pergunta}"
            
            Retorne APENAS o comando SQL necessário para buscar essa informação. 
            Não use formatação markdown, não escreva 'sql', apenas a query.
        `;

        const resultadoSQL = await model.generateContent(promptSQL);
        const query = resultadoSQL.response.text().trim();
        console.log("SQL gerado pela IA:", query);

        // 2. RODAMOS NO BANCO DE DADOS
        const [dadosDoBanco] = await db.query(query);

        // 3. PEDIMOS A RESPOSTA HUMANIZADA
        const promptResposta = `
            O usuário fez esta pergunta: "${pergunta}"
            A nossa busca no banco de dados retornou isso: ${JSON.stringify(dadosDoBanco)}
            
            Baseado EXCLUSIVAMENTE nesses dados, responda o usuário de forma amigável, 
            como se fosse um recepcionista da clínica veterinária Zoonix.
        `;

        const resultadoFinal = await model.generateContent(promptResposta);
        const respostaFormatada = resultadoFinal.response.text();

        res.json({ resposta: respostaFormatada });

    } catch (erro) {
        console.error("Erro no agente:", erro);
        res.status(500).json({ erro: "Desculpe, não consegui processar a pergunta." });
    }
});

export default router;