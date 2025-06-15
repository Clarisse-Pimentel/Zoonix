import {db} from '../db.js';
export const listarFuncionarios = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM funcionarios');
    res.json(results);
  } catch (err) {
    res.status(500).send('Erro ao buscar funcionários.');
  }
}; // talvez colocar o select com join para trazer os dados dos veterinários e administradores

export const cadastrarFuncionario = async (req, res) => {
    const { nome, cpf, cargo, telefone, email, senha } = req.body;

    if (!nome || !cpf || !cargo || !telefone || !email || !senha) {
        return res.status(400).send('Preencha todos os campos obrigatórios.');
    }
    
 
    try {
      await db.beginTransaction();

      const [result] = await db.query(
        'INSERT INTO funcionarios (nome, cpf, cargo, telefone, email, senha) VALUES (?, ?, ?, ?, ?, ?)',
        [nome, cpf, cargo, telefone, email, senha]
      );

      const cargotipo = cargo.toLowerCase();

      if (cargotipo === 'Veterinário' || cargotipo === 'Veterinária'|| cargotipo === 'veterinario') {
        const { crmv, especialidade } = req.body;
        if (!crmv || !especialidade) {
          await db.rollback();
          return res.status(400).send('Preencha todos os campos obrigatórios para veterinários.');
        }
        await db.query(
          'INSERT INTO veterinarios (id_funcionarios, crmv, especialidade) VALUES (?, ?, ?)',
          [result.insertId, crmv, especialidade]
        );
      }
      
      if (cargotipo === 'Administrador'){
        await db.query(
          'INSERT INTO administradores (funcionario_id) VALUES (?)',
          [result.insertId]
        );
      }
      await db.commit();
      res.status(201).send('Funcionário cadastrado com sucesso!');

    } catch (err) {
      await db.rollback();
      console.error('Erro ao cadastrar funcionário:', err);
      res.status(500).send('Erro ao cadastrar funcionário.');
    }
  }

  export const atualizarFuncionario = async (req, res) => {
    const { id } = req.params;
    const { nome, cpf, cargo, telefone, email, senha } = req.body;

    if (!nome || !cpf || !cargo || !telefone || !email || !senha) {
      return res.status(400).send('Preencha todos os campos obrigatórios.');
    }

    try {
      const [result] = await db.query(
        'UPDATE funcionarios SET nome = ?, cpf = ?, cargo = ?, telefone = ?, email = ?, senha = ? WHERE id = ?',
        [nome, cpf, cargo, telefone, email, senha, id]
      );

      if (cargo === 'Veterinário') {
        const { crmv, especialidade } = req.body;
        const [vetResult] = await db.query(
          'UPDATE veterinarios SET crmv = ?, especialidade = ? WHERE funcionario_id = ?',
          [crmv, especialidade, id]
        );

      }

      if (result.affectedRows === 0) return res.status(404).send('Funcionário não encontrado.');

      res.send('Funcionário atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar funcionário:', err);
      res.status(500).send('Erro ao atualizar funcionário.');
    }
  }
export const deletarFuncionario = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM funcionarios WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).send('Funcionário não encontrado.');
    res.send('Funcionário deletado com sucesso!');
  } catch (err) {
    console.error('Erro ao deletar funcionário:', err);
    res.status(500).send('Erro ao deletar funcionário.');
  }
}

export const buscarFuncionarioPorId = async (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM funcionarios WHERE id = ?';

  try {
    const [results] = await db.query(sql, [id]);
    if (results.length === 0) return res.status(404).send('Funcionário não encontrado.');
    res.json(results[0]);
  } catch (err) {
    console.error('Erro ao buscar funcionário:', err);
    res.status(500).send('Erro ao buscar funcionário.');
  }
};