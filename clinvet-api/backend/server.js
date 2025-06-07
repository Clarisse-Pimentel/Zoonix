import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import pacientesRoutes from './routes/pacientes.js';



// Pega o caminho absoluto do diretório do servidor
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, '..', 'frontend', 'Pacientes');

const app = express();
app.use(cors());
app.use(express.json());


// Serve os arquivos estáticos da pasta 'frontend'
app.use(express.static(frontendPath));

// Rotas da API
app.use('/pacientes', pacientesRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('API ClinVet+ funcionando!');
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
