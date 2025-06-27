import { jest } from '@jest/globals';

let cadastrarPaciente, db;

beforeAll(async () => {
  jest.unstable_mockModule('../db.js', () => ({
    db: {
      query: jest.fn()
    }
  }));

  ({ db } = await import('../db.js'));
  ({ cadastrarPaciente } = await import('../controllers/pacientesController.js'));
    ({ atualizarPaciente } = await import('../controllers/pacientesController.js'));
    ({ deletarPaciente } = await import('../controllers/pacientesController.js'));
});

describe('Função cadastrarPaciente', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        nome: 'Totó',
        raca: 'Poodle',
        especie: 'Cão',
        sexo: 'M',
        idade: 3,
        tutor: 'João',
        telefone_tutor: '123456789'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    db.query.mockReset();
  });

  test('deve cadastrar paciente com dados válidos', async () => {
    db.query
      .mockResolvedValueOnce([[]]) // SELECT pacientes WHERE telefone
      .mockResolvedValueOnce([[]]) // SELECT funcionarios WHERE telefone
      .mockResolvedValueOnce([{ affectedRows: 1 }]); // INSERT paciente

    await cadastrarPaciente(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith('Paciente cadastrado com sucesso!');
  });

  test('deve retornar erro se nome não for informado', async () => {
    req.body.nome = '';
    await cadastrarPaciente(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Preencha todos os campos obrigatórios.');
  });

  test('deve retornar erro se espécie não for informada', async () => {
    req.body.especie = '';
    await cadastrarPaciente(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Preencha todos os campos obrigatórios.');
  });

  test('deve retornar erro se dados incompletos', async () => {
    req.body = {};
    await cadastrarPaciente(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Preencha todos os campos obrigatórios.');
  });
});

describe('Função atualizarPaciente', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: '1' },
      body: {
        nome: 'Totó Atualizado',
        raca: 'Vira-lata',
        especie: 'Cão',
        sexo: 'M',
        idade: 4,
        tutor: 'João Atualizado',
        telefone_tutor: '999999999'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    db.query.mockReset();
  });

  test('deve atualizar paciente com dados válidos', async () => {
    db.query
      .mockResolvedValueOnce([[]]) // telefone_tutor não duplicado em pacientes
      .mockResolvedValueOnce([[]]) // telefone_tutor não existe em funcionarios
      .mockResolvedValueOnce([{ affectedRows: 1 }]); // update com sucesso

    await atualizarPaciente(req, res);

    expect(res.send).toHaveBeenCalledWith('Paciente atualizado com sucesso!');
  });
});

describe('Função deletarPaciente', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: '1' }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    db.query.mockReset();
  });

  test('deve deletar paciente com ID válido', async () => {
    db.query
      .mockResolvedValueOnce([{ affectedRows: 1 }]); // DELETE paciente

    await deletarPaciente(req, res);

    expect(res.send).toHaveBeenCalledWith('Paciente deletado com sucesso!');
  });

  test('deve retornar erro se paciente não encontrado', async () => {
    db.query
      .mockResolvedValueOnce([{ affectedRows: 0 }]); // DELETE paciente não encontrado

    await deletarPaciente(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Paciente não encontrado.');
  });
});