# ClinVet+ - Sistema de Gerenciamento para Clínica Veterinária

## Descrição
Este projeto é um sistema web para gerenciamento de pacientes de clínica veterinária.  
Ele possui backend em Node.js com Express, frontend em HTML/JS/CSS e banco de dados MySQL.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- [MySQL](https://dev.mysql.com/downloads/mysql/) instalado e rodando
- Editor de texto ou IDE (opcional)

---

## Configuração do Banco de Dados

1. Abra seu MySQL Workbench ou outro cliente MySQL.  
2. Importe o arquivo `clinvet.sql` que está na raiz do projeto.  
   Esse arquivo contém o script para criar o banco de dados e as tabelas necessárias.

```bash
# Exemplo para importar via linha de comando:
mysql -u seu_usuario -p < clinvet.sql

3. Anote usuário, senha e nome do banco para configurar no backend.


Configuração do Backend
Entre na pasta do backend:

cd clinvet-api

Instale as dependências:
npm install

Configure as credenciais do banco de dados no arquivo db.js ou no .env (conforme seu projeto):

// Exemplo em db.js
const connection = mysql.createConnection({
  host: "localhost",
  user: "seu_usuario",
  password: "sua_senha",
  database: "nome_do_banco"
});
Rodando o Backend
No terminal, dentro da pasta do backend, execute:

node server.js
O servidor rodará em http://localhost:3000.

Rodando o Frontend
Abra o arquivo frontend/index.html (ou a página inicial do frontend) diretamente no navegador (clicando duas vezes).

Ou, se preferir, use um servidor estático para servir o frontend (exemplo: Live Server no VSCode).