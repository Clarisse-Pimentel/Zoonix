# 🐾 ClinVet+
Este projeto visa desenvolver um sistema web para clínica veterinária, oferecendo funcionalidades de cadastro, edição, listagem e exclusão (CRUD) de pacientes, tutores, veterinários, atendimentos e usuários autorizados. O sistema contará com uma interface simples e intuitiva, priorizando a acessibilidade do usuário e a organização dos dados clínicos. Será possível registrar atendimentos com diagnóstico e tratamento, vinculados ao paciente e seu responsável, permitindo o acompanhamento da saúde do animal ao longo do tempo. O acesso ao sistema será restrito por meio de login com autenticação, garantindo que apenas usuários autorizados possam visualizar e modificar as informações.

# 👤 **Autores**
- [Clarisse Lacerda Pimentel](https://github.com/Clarisse-Pimentel)
- [Julia Aparecida de Faria Morais](https://github.com/eijuliamorais)
- [Pedro Henrique Souza Perazza Martins](https://github.com/PedroidG) 

# 🔑 **Principais Funcionalidades**
- Cadastro, alteração e exclusão de dados referentes aos pacientes, funcionários e consultas;
- Agendamento de consultas;
- Geração de uma ficha com as informações dos pacientes;
- Venda de produtos veterinários.

## 📌 Regras de Uso do Git

Para manter a organização e a colaboração eficiente no desenvolvimento do sistema ClinVet+, definimos as seguintes regras para uso do Git:
### 📝 Padrão de Commits
Utilize a seguinte convenção para mensagens de commit:
tipo: descrição breve
**Tipos aceitos:**
- `feat`: nova funcionalidade
- `fix`: correção de bug
- `docs`: alterações na documentação
- `style`: formatação do código (sem alterar lógica)
- `refactor`: refatoração (melhoria interna sem mudança de comportamento)
- `test`: testes adicionados ou corrigidos
- `chore`: tarefas menores (configs, dependências, ajustes diversos)

### 🌿 Padrão de Branches

- `main`  
  Branch estável, versão pronta para produção.

- `dev`  
  Branch principal de desenvolvimento, onde as funcionalidades são integradas.

> 📌 Todas as novas funcionalidades e correções são feitas diretamente na branch `dev`.  


---


## ✅ Boas Práticas de Codificação

Todas as pessoas desenvolvedoras do projeto devem seguir as práticas abaixo para garantir um código limpo, organizado e de fácil manutenção:

1. **Comentário de código claro e necessário**  
   Comentários devem ser usados apenas para explicar trechos relevantes ou complexos.

2. **Padrão de Notação**  
   Manter uma padronização nos nomes de variáveis, funções e classes para facilitar a leitura.

3. **Aplicação de princípios SOLID**  
   Utilizar os princípios SOLID como base para uma arquitetura bem estruturada.

4. **Uso do Clean Code**  
   Escrever código limpo, legível e com funções que tenham responsabilidade única.

5. **Evitar código duplicado**  
   Sempre que possível, reutilizar trechos de código por meio de funções e componentes.

6. **Organização dos arquivos**  
   Manter o projeto organizado, com os arquivos separados por responsabilidade ou funcionalidade.

---

# 💡 Tecnologias Utilizadas
## 🖥️ Frontend
- Tecnologias utilizadas para a interface do usuário:
- **HTML5**
- **CSS3**
- **JavaScript**

## ⚙️ Backend
Tecnologia escolhida para o desenvolvimento da lógica de servidor:
- **Node.js** versão v1.80+  
- **Express.js**

## 🗄️ Banco de Dados
Banco de dados relacional utilizado:
- **MySQL** v8.0+

## 🌍 Servidor de Desenvolvimento
- **Servidor HTTP Local** via Node.js + Express

## 💻 Ambiente de Desenvolvimento
- **Visual Studio Code** v1.80+

## 📥 Instalação e Execução
1. Clone o repositório:
```
git clone https://github.com/Clarisse-Pimentel/Zoonix.git
cd Zoonix
```
2. Configure o banco de dados MySQL:
   - O banco `clinvet` será criado automaticamente ao iniciar o servidor (usando o script `clinvet.sql`)
   - Ajuste as credenciais no arquivo `backend/db.js` conforme seu ambiente

3. Inicie o servidor backend:

   ```bash
   cd backend
   npm start
   node server.js
   ```

4. Acesse o frontend:
   - Abra o arquivo `index.html` no navegador
   - Ou utilize um servidor local como Live Server (VSCode)
