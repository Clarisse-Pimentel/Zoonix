import db from '../db.js';

export const listarPacientes = (req, res) => {
  db.query('SELECT * FROM pacientes', (err, results) => {
    if (err) return res.status(500).send('Erro ao buscar pacientes.');
    res.json(results);
  });
};

export const cadastrarPaciente = (req, res) => {
  const { nome, raca, especie, sexo, idade, tutor, telefone_tutor } = req.body;

  if (!nome || !especie || !tutor || !sexo) {
    return res.status(400).send('Preencha todos os campos obrigatórios.');
  }

  const sql = `
    INSERT INTO pacientes (nome, raca, especie, sexo, idade, tutor, telefone_tutor)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [nome, raca, especie, sexo, idade, tutor, telefone_tutor];

  db.query(sql, values, (err) => {
    if (err) return res.status(500).send('Erro ao cadastrar paciente.');
    res.status(201).send('Paciente cadastrado com sucesso!');
  });
};

export const atualizarPaciente = (req, res) => {
  const { id } = req.params;
  const { nome, raca, especie, sexo, idade, tutor, telefone_tutor } = req.body;

  const sql = `
    UPDATE pacientes SET nome = ?, raca = ?, especie = ?, sexo = ?, idade = ?, tutor = ?, telefone_tutor = ?
    WHERE id = ?
  `;
  const values = [nome, raca, especie, sexo, idade, tutor, telefone_tutor, id];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).send('Erro ao atualizar paciente.');
    if (result.affectedRows === 0) return res.status(404).send('Paciente não encontrado.');
    res.send('Paciente atualizado com sucesso!');
  });
};

export const deletarPaciente = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM pacientes WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).send('Erro ao deletar paciente.');
    if (result.affectedRows === 0) return res.status(404).send('Paciente não encontrado.');
    res.send('Paciente deletado com sucesso!');
  });
};

export const buscarPacientePorId = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM pacientes WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).send('Erro ao buscar paciente.');
    if (results.length === 0) return res.status(404).send('Paciente não encontrado.');
    res.json(results[0]);
  });
};