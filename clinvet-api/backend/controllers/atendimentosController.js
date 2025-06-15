import {db} from '../db.js';

export const listarAtendimentos = async (req, res) => {
  try {
    const [results] = await db.query(`
    SELECT a.id, p.nome AS nome_paciente, v.id_funcionarios AS id_veterinario, 
        f.nome AS funcionario_cadastrante, a.diagnostico, a.tratamento, a.data
    FROM atendimentos a
    JOIN pacientes p ON a.id_pacientes = p.id
    JOIN funcionarios f ON a.id_funcionarios = f.id
    JOIN veterinarios v ON a.id_veterinario = v.id_funcionarios
        `);
    res.json(results);
  } catch (err) {
    console.error('Erro ao buscar atendimentos:', err);
    res.status(500).send('Erro ao buscar atendimentos.');
  }
};

export const cadastrarAtendimento = async (req, res) => {
  const { nome_paciente, nome_veterinario, diagnostico, tratamento, nome_funcionario_cadastrante, data } = req.body;

  if (!nome_paciente || !nome_veterinario || !diagnostico || !tratamento || !nome_funcionario_cadastrante || !data) {
    return res.status(400).send('Preencha todos os campos obrigatórios.');
  }

  try {
    const [paciente] = await db.query('SELECT id FROM pacientes WHERE nome = ?', [nome_paciente]);
    if (paciente.length === 0) {
      return res.status(404).send('Paciente não encontrado.');
    }
    const id_pacientes = paciente[0].id;

    const [veterinario] = await db.query(`
      SELECT v.id_funcionarios FROM veterinarios v
      JOIN funcionarios f ON v.id_funcionarios = f.id
      WHERE f.nome = ?
    `, [nome_veterinario]);
    if (veterinario.length === 0) {
      return res.status(404).send('Veterinário não encontrado.');
    }
    const id_veterinario = veterinario[0].id_funcionarios;

    const [funcionario] = await db.query('SELECT id FROM funcionarios WHERE nome = ?', [nome_funcionario_cadastrante]);
    if (funcionario.length === 0) {
      return res.status(404).send('Funcionário não encontrado.');
    }
    const id_funcionarios = funcionario[0].id;

    const dataFormatada = new Date(data).toISOString().slice(0, 19).replace('T', ' ');
    await db.query(`
        INSERT INTO atendimentos (id_pacientes, id_funcionarios, id_veterinario, diagnostico, tratamento, data)
        VALUES (?, ?, ?, ?, ?, ?)
        `, [id_pacientes, id_funcionarios, id_veterinario, diagnostico, tratamento, dataFormatada]);
    res.status(201).send('Atendimento cadastrado com sucesso!');
  } catch (err) {
    console.error('Erro ao cadastrar atendimento:', err);
    res.status(500).send('Erro ao cadastrar atendimento.');
  }
};

export const atualizarAtendimento = async (req, res) => {
    const { id } = req.params;
    const { nome_paciente, nome_veterinario, diagnostico, tratamento, nome_funcionario_cadastrante, data } = req.body;
    if (!nome_paciente || !nome_veterinario || !diagnostico || !tratamento || !nome_funcionario_cadastrante || !data) {
      return res.status(400).send('Preencha todos os campos obrigatórios.');
    }

    try {
        const [paciente] = await db.query('SELECT id FROM pacientes WHERE nome = ?', [nome_paciente]);
        if (paciente.length === 0) {
            return res.status(404).send('Paciente não encontrado.');
        }
        const id_pacientes = paciente[0].id;

        const [veterinario] = await db.query(`
            SELECT v.id_funcionarios FROM veterinarios v
            JOIN funcionarios f ON v.id_funcionarios = f.id
            WHERE f.nome = ?
        `, [nome_veterinario]);
        if (veterinario.length === 0) {
            return res.status(404).send('Veterinário não encontrado.');
        }
        const id_veterinario = veterinario[0].id_funcionarios;

        const [funcionario] = await db.query('SELECT id FROM funcionarios WHERE nome = ?', [nome_funcionario_cadastrante]);
        if (funcionario.length === 0) {
            return res.status(404).send('Funcionário não encontrado.');
        }
        const id_funcionarios = funcionario[0].id;

        const dataFormatada = new Date(data).toISOString().slice(0, 19).replace('T', ' ');
        const [result] = await db.query(`
            UPDATE atendimentos
            SET id_pacientes = ?, id_funcionarios = ?, id_veterinario = ?, diagnostico = ?, tratamento = ?, data = ?
            WHERE id = ?
        `, [id_pacientes, id_funcionarios, id_veterinario, diagnostico, tratamento, dataFormatada, id]);
        if (result.affectedRows === 0) {
            return res.status(404).send('Atendimento não encontrado para atualização.');
        }
        res.status(200).send('Atendimento atualizado com sucesso!');
    } catch (err) {
        console.error('Erro ao atualizar atendimento:', err);
        res.status(500).send('Erro ao atualizar atendimento.');
    }
};

export const deletarAtendimento = async (req, res) => {
  const { id } = req.params;
  const {usuarioResponsavel} = req.body;
  
  if (!usuarioResponsavel) {
    return res.status(401).send('Responsável pela exclusão não informado.');
  }

  try {
    // Verifica se o atendimento existe
    const [atendimento] = await db.query('SELECT * FROM atendimentos WHERE id = ?', [id]);
    if (atendimento.length === 0) {
      return res.status(404).send('Atendimento não encontrado.');
    }

    // Deleta o atendimento
    const [result] = await db.query('DELETE FROM atendimentos WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).send('Atendimento não encontrado para exclusão.');
    }

    // Log de exclusão
    const [funcionario] = await db.query('SELECT id FROM funcionarios WHERE nome = ?', [usuarioResponsavel]);
    if (funcionario.length === 0) {
    return res.status(404).send('Funcionário responsável não encontrado.');
    }
    const id_funcionario_responsavel = funcionario[0].id;
    const dataHora = new Date().toISOString().slice(0, 19).replace('T', ' ');

await db.query(`
  INSERT INTO log_exclusoes (tabela_afetada, id_registro, data_hora, id_funcionario_responsavel)
  VALUES (?, ?, ?, ?)
`, ['atendimentos', id, dataHora, id_funcionario_responsavel]);

    res.send('Atendimento deletado com sucesso!');
  } catch (err) {
    console.error('Erro ao deletar atendimento:', err);
    res.status(500).send('Erro ao deletar atendimento.');
  }
};

export const buscarAtendimentoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await db.query(`
      SELECT a.id, p.nome AS nome_paciente, v.id_funcionarios AS id_veterinario, 
          f.nome AS funcionario_cadastrante, a.diagnostico, a.tratamento, a.data
      FROM atendimentos a
      JOIN pacientes p ON a.id_pacientes = p.id
      JOIN funcionarios f ON a.id_funcionarios = f.id
      JOIN veterinarios v ON a.id_veterinario = v.id_funcionarios
      WHERE a.id = ?
    `, [id]);

    if (results.length === 0) {
      return res.status(404).send('Atendimento não encontrado.');
    }

    res.json(results[0]);
  } catch (err) {
    console.error('Erro ao buscar atendimento:', err);
    res.status(500).send('Erro ao buscar atendimento.');
  }
};
