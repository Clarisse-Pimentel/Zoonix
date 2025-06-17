import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './db.js'; 

import atendimentosRoutes from './routes/atendimentos.js';
import funcionariosRoutes from './routes/funcionarios.js';
import pacientesRoutes from './routes/pacientes.js';
//import loginRoutes from './routes/login.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, '..', 'frontend', 'Pacientes'); //tem q mudar

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve os arquivos estáticos da pasta 'frontend'
app.use(express.static(frontendPath));

// Rotas da API
app.use('/pacientes', pacientesRoutes);
app.use('/funcionarios', funcionariosRoutes);
app.use('/atendimentos', atendimentosRoutes);
app.use('/login', loginRoutes);


// Rota de teste
app.get('/', (req, res) => {
  res.send('API ClinVet+ funcionando!');
});

// Inicializa banco e só então sobe o servidor
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);

  });
}).catch((err) => {
  console.error('Erro ao iniciar o banco de dados:', err);
});
