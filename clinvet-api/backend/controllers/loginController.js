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

    try {
      const [resultado] = await db.execute(
        'INSERT INTO funcionarios (nome, cpf, cargo, senha) VALUES (?, ?, ?, ?)',
        ['Administrador', cpf, cargo, hash]
      );
      console.log('Resultado do insert funcionarios:', resultado);

      const novoId = resultado.insertId;
      console.log('Novo ID do admin:', novoId);

      await db.execute(
        'INSERT INTO administradores (id_funcionarios) VALUES (?)',
        [novoId]
      );
      console.log('Admin inserido na tabela administradores!');

      return true;
    } catch (err) {
      console.error('Erro ao criar admin inicial:', err);
      return false;
    }
  }
  return false; // admin já existe
}

// Controle de tentativas de login (em memória)
const tentativasLogin = {}; 
const TEMPO_BLOQUEIO_MS = 5 * 60 * 1000; // 5 minutos

// Função auxiliar para incrementar tentativas e bloquear se necessário
function registrarTentativa(cpf, res, mensagem = 'CPF ou senha incorretos.') {
  if (!tentativasLogin[cpf]) tentativasLogin[cpf] = { count: 0, bloqueadoAte: null };
  tentativasLogin[cpf].count += 1;

  if (tentativasLogin[cpf].count >= 3) {
    tentativasLogin[cpf].bloqueadoAte = Date.now() + TEMPO_BLOQUEIO_MS;
    return res.status(429).json({ mensagem: 'Muitas tentativas incorretas. Login bloqueado por 5 minutos.' });
  }
  return res.status(401).json({ mensagem });
}

export const login = async (req, res) => {
  const { cpf, senha } = req.body;

  // Verifica bloqueio
  const registro = tentativasLogin[cpf];
  if (registro && registro.bloqueadoAte && Date.now() < registro.bloqueadoAte) {
    const tempoRestante = Math.ceil((registro.bloqueadoAte - Date.now()) / 1000);
    return res.status(429).json({ mensagem: `Login bloqueado. Tente novamente em ${tempoRestante} segundos.` });
  }

  try {
    // Verifica se é o primeiro acesso
    const [todosFuncionarios] = await db.execute('SELECT * FROM funcionarios');

    if (todosFuncionarios.length === 0) {
      if (senha !== 'admin123') {
        return res.status(401).json({
          mensagem: 'Senha incorreta. No primeiro acesso, use a senha padrão: admin123.'
        });
      }
    }

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
          cargo: 'administrador'
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
      return registrarTentativa(cpf, res, 'CPF não encontrado');
    }

    const usuario = usuarios[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return registrarTentativa(cpf, res, 'Senha incorreta');
    }

    const [admins] = await db.execute(
      'SELECT * FROM administradores WHERE id_funcionarios = ?',
      [usuario.id]
    );

    const tipoUsuario = admins.length > 0
      ? 'administrador'
      : (usuario.cargo || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        cpf: usuario.cpf,
        cargo: tipoUsuario
      },
      secret,
      { expiresIn: '1h' }
    );

    // Se login for bem-sucedido, reseta tentativas
    if (tentativasLogin[cpf]) delete tentativasLogin[cpf];

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
    // Erros inesperados
    return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
};
