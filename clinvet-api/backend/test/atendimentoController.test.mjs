import { jest } from '@jest/globals';

let cadastrarAtendimento, db;

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

beforeAll(async () => {
  jest.unstable_mockModule('../db.js', () => ({
    db: {
      query: jest.fn()
    }
  }));

  ({ db } = await import('../db.js'));
  ({ cadastrarAtendimento } = await import('../controllers/atendimentosController.js'));
});

describe('Função cadastrarAtendimento', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        nome_paciente: 'Totó',
        id_veterinario: 2,
        diagnostico: 'Otite',
        tratamento: 'Antibiótico',
        id_funcionario: 1,
        data: '2024-06-28'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    db.query.mockReset();
  });

  test('deve cadastrar atendimento com dados válidos', async () => {
    // Mock para encontrar paciente
    db.query
      .mockResolvedValueOnce([[{ id: 10 }]]) // SELECT id FROM pacientes WHERE nome = ?
      .mockResolvedValueOnce(); // INSERT INTO atendimentos

    await cadastrarAtendimento(req, res);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT id FROM pacientes WHERE nome = ?'),
      ['Totó']
    );
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO atendimentos'),
      expect.any(Array)
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith('Atendimento cadastrado com sucesso!');
  });

  test('deve retornar erro se faltar campos obrigatórios', async () => {
    req.body.nome_paciente = '';
    await cadastrarAtendimento(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Preencha todos os campos obrigatórios.');
  });

  test('deve retornar erro se paciente não encontrado', async () => {
    db.query.mockResolvedValueOnce([[]]); // SELECT id FROM pacientes WHERE nome = ?

    await cadastrarAtendimento(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Paciente não encontrado.');
  });

  test('deve retornar erro 500 em caso de exceção', async () => {
    db.query.mockRejectedValueOnce(new Error('DB error'));

    await cadastrarAtendimento(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Erro ao cadastrar atendimento.');
  });
});