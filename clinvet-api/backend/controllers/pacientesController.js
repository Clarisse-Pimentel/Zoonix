import { db } from '../db.js';

export const listarPacientes = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM pacientes');
    res.json(results);
  } catch (err) {
    res.status(500).send('Erro ao buscar pacientes.');
  }
};

export const cadastrarPaciente = async (req, res) => {
  const { nome, raca, especie, sexo, idade, tutor, telefone_tutor } = req.body;

  if (!nome || !especie || !tutor || !sexo) {
    return res.status(400).send('Preencha todos os campos obrigatórios.');
  }

  const sql = `
    INSERT INTO pacientes (nome, raca, especie, sexo, idade, tutor, telefone_tutor)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [nome, raca, especie, sexo, idade, tutor, telefone_tutor];

  try {
    await db.query(sql, values);
    res.status(201).send('Paciente cadastrado com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao cadastrar paciente.');
  }
};

export const atualizarPaciente = async (req, res) => {
  const { id } = req.params;
  const { nome, raca, especie, sexo, idade, tutor, telefone_tutor } = req.body;

  const sql = `
    UPDATE pacientes SET nome = ?, raca = ?, especie = ?, sexo = ?, idade = ?, tutor = ?, telefone_tutor = ?
    WHERE id = ?
  `;
  const values = [nome, raca, especie, sexo, idade, tutor, telefone_tutor, id];

  try {
    const [result] = await db.query(sql, values);
    if (result.affectedRows === 0) return res.status(404).send('Paciente não encontrado.');
    res.send('Paciente atualizado com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao atualizar paciente.');
  }
};

export const deletarPaciente = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM pacientes WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).send('Paciente não encontrado.');
    res.send('Paciente deletado com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao deletar paciente.');
  }
};

export const buscarPacientePorId = async (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM pacientes WHERE id = ?';

  try {
    const [results] = await db.query(sql, [id]);
    if (results.length === 0) return res.status(404).send('Paciente não encontrado.');
    res.json(results[0]);
  } catch (err) {
    res.status(500).send('Erro ao buscar paciente.');
  }
};
