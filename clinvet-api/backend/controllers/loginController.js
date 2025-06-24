import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../db.js';

const secret = 'clinvet13579vet45813'; 

// rota para verificar se tem algum funcionário cadastrado
export const verificarPrimeiroAcesso = async (req, res) => {
  try {
    const [todosFuncionarios] = await db.execute('SELECT * FROM funcionarios');

    if (todosFuncionarios.length === 0) {
      return res.json({ primeiroAcesso: true, mensagem: 'Primeiro acesso: use o CPF desejado e a senha padrão "admin123".' });
    } else {
      return res.json({ primeiroAcesso: false });
    }
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
};


// Função para criar admin se não existir nenhum funcionário
async function criarAdminInicial(cpf, senhaPadrao = 'admin123') {
  const [todosFuncionarios] = await db.execute('SELECT * FROM funcionarios');

  if (todosFuncionarios.length === 0) {
    const hash = await bcrypt.hash(senhaPadrao, 10);
    const cargo = 'administrador';

    const [resultado] = await db.execute(
      'INSERT INTO funcionarios (nome, cpf, cargo, senha) VALUES (?, ?, ?, ?)',
      ['Administrador', cpf, cargo, hash]
    );

    const novoId = resultado.insertId;

    await db.execute(
      'INSERT INTO administradores (id_funcionarios) VALUES (?)',
      [novoId]
    );

    return true; // avisar que criou admin
  }
  return false; // admin já existe
}

export const login = async (req, res) => {
  const { cpf, senha } = req.body;

  try {
    // Tenta criar admin se nenhum funcionário existir
    const adminCriado = await criarAdminInicial(cpf);

    if (adminCriado) {
      // Busca o usuário criado (admin)
      const [usuarios] = await db.execute(
        'SELECT * FROM funcionarios WHERE cpf = ?',
        [cpf]
      );
      const usuario = usuarios[0];

      // Já que é admin criado agora, senha padrão é 'admin123'
      const token = jwt.sign(
        {
          id: usuario.id,
          nome: usuario.nome,
          cpf: usuario.cpf,
          tipo: 'administrador'
        },
        secret,
        { expiresIn: '1h' }
      );

      // Retorna token e dados do admin criado
      return res.status(201).json({
        mensagem: 'Administrador criado com sucesso! Login realizado.',
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          cargo: 'administrador'
        }
      });
    }

    // Agora tenta achar o usuário normalmente
    const [usuarios] = await db.execute(
      'SELECT * FROM funcionarios WHERE cpf = ?',
      [cpf]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ mensagem: 'CPF não encontrado' });
    }

    const usuario = usuarios[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    console.log('Senha enviada:', senha);
    console.log('Senha no banco:', usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'Senha incorreta' });
    }

    const [admins] = await db.execute(
      'SELECT * FROM administradores WHERE id_funcionarios = ?',
      [usuario.id]
    );

    const tipoUsuario = admins.length > 0 ? 'administrador' : usuario.cargo;

    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        cpf: usuario.cpf,
        tipo: tipoUsuario
      },
      secret,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso!',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        cargo: tipoUsuario
      }
    });

  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
};
