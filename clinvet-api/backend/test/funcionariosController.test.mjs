import { jest } from '@jest/globals';

let cadastrarFuncionario, db, bcrypt;

beforeAll(async () => {
  jest.unstable_mockModule('../db.js', () => ({
    db: {
      query: jest.fn(),
      beginTransaction: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn()
    }
  }));

  jest.unstable_mockModule('bcrypt', () => ({
    default: {
      hash: jest.fn()
    }
  }));

  ({ db } = await import('../db.js'));
  ({ cadastrarFuncionario } = await import('../controllers/funcionariosController.js'));
  ({ atualizarFuncionario } = await import('../controllers/funcionariosController.js'));
  ({ deletarFuncionario } = await import('../controllers/funcionariosController.js'));
  bcrypt = (await import('bcrypt')).default;
});

describe('Função cadastrarFuncionario', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        nome: 'Maria',
        cpf: '12345678900',
        cargo: 'administrador',
        telefone: '11999999999',
        email: 'maria@email.com',
        senha: 'senha123'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    db.query.mockReset();
    db.beginTransaction.mockReset();
    db.commit.mockReset();
    db.rollback.mockReset();
    bcrypt.hash.mockReset();
  });

  test('deve cadastrar funcionário administrador com dados válidos', async () => {
    db.query
      .mockResolvedValueOnce([[]]) // SELECT id FROM funcionarios WHERE cpf = ?
      .mockResolvedValueOnce([[]]) // SELECT id FROM pacientes WHERE telefone_tutor = ?
      .mockResolvedValueOnce([[]]) // SELECT id FROM funcionarios WHERE telefone = ?
      .mockResolvedValueOnce([{ insertId: 1 }]) // INSERT INTO funcionarios
      .mockResolvedValueOnce([{ insertId: 1 }]); // INSERT INTO administradores

    db.beginTransaction.mockResolvedValue();
    db.commit.mockResolvedValue();
    bcrypt.hash.mockResolvedValue('senha-hash');

    await cadastrarFuncionario(req, res);

    expect(db.beginTransaction).toHaveBeenCalled();
    expect(db.commit).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith('Funcionário cadastrado com sucesso!');
  });

  test('deve retornar erro se CPF já cadastrado', async () => {
    db.query.mockResolvedValueOnce([[{ id: 1 }]]); // CPF já existe

    await cadastrarFuncionario(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.send).toHaveBeenCalledWith('CPF já cadastrado.');
  });

  test('deve retornar erro se telefone já cadastrado', async () => {
    db.query
      .mockResolvedValueOnce([[]]) // CPF não existe
      .mockResolvedValueOnce([[{ id: 1 }]]) // Telefone existe em pacientes
      .mockResolvedValueOnce([[]]); // Telefone não existe em funcionarios

    await cadastrarFuncionario(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.send).toHaveBeenCalledWith('Telefone já cadastrado.');
  });

  test('deve retornar erro se faltar campos obrigatórios', async () => {
    req.body.nome = '';
    await cadastrarFuncionario(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Preencha todos os campos obrigatórios.');
  });
});
/*
describe('Função atualizarFuncionario', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 1 },
      body: {
        nome: 'Maria Atualizada',
        cpf: '12345678900',
        cargo: 'administrador',
        telefone: '11999999999',
        email: 'maria@email.com',
        senha: 'novaSenha123'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    db.query.mockReset();
    bcrypt.hash.mockReset();
  });

  test('deve atualizar funcionário com dados válidos', async () => {
    // Para sucesso (funcionário existe e update ocorre)
    db.query
      .mockResolvedValueOnce([[{ id: 1 }]]) // Confirma existência do funcionário
      .mockResolvedValueOnce([[]]) // Verifica se telefone já existe em outro funcionário
      .mockResolvedValueOnce([[{ affectedRows: 1 }]]); // UPDATE (precisa ser array duplo)

    bcrypt.hash.mockResolvedValue('novaSenhaHash');

    await atualizarFuncionario(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('Funcionário atualizado com sucesso!');
  });

  test('deve retornar erro se funcionário não encontrado', async () => {
    db.query.mockResolvedValueOnce([[]]); // Não encontrou funcionário

    await atualizarFuncionario(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Funcionário não encontrado.');
  });

  test('deve retornar erro se faltar campos obrigatórios', async () => {
    req.body.nome = '';
    await atualizarFuncionario(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Preencha todos os campos obrigatórios.');
  });
});

describe('Função deletarFuncionario', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 1 }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    db.query.mockReset();
  });

  test('deve deletar funcionário com ID válido', async () => {
    db.query.mockResolvedValueOnce([[{ affectedRows: 1 }]]); // DELETE

    await deletarFuncionario(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('Funcionário deletado com sucesso!');
  });

  test('deve retornar erro se funcionário não encontrado', async () => {
    db.query.mockResolvedValueOnce([[{ affectedRows: 0 }]]); // Nada deletado

    await deletarFuncionario(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Funcionário não encontrado.');
  });
});
*/