import {db} from '../db.js';
import bcrypt from 'bcrypt';

export const listarFuncionarios = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT f.*, v.crmv, v.especialidade
      FROM funcionarios f
      LEFT JOIN veterinarios v ON f.id = v.id_funcionarios
      `);
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
      // Verifica se o CPF já existe
    const [cpfExistente] = await db.query(
      'SELECT id FROM funcionarios WHERE cpf = ?',
      [cpf]
    );

    if (cpfExistente.length > 0) {
      return res.status(409).send('CPF já cadastrado.');
    }

      await db.beginTransaction();

      const senhaCriptografada = await bcrypt.hash(senha, 10);

      const [result] = await db.query(
        'INSERT INTO funcionarios (nome, cpf, cargo, telefone, email, senha) VALUES (?, ?, ?, ?, ?, ?)',
        [nome, cpf, cargo, telefone, email, senhaCriptografada]
      );

      /*const cargotipo = cargo.toLowerCase();

      if (cargotipo === 'veterinário' || cargotipo === 'veterinária'|| cargotipo === 'veterinario'|| cargotipo === 'veterinaria') {
      */
      if(cargo == 'veterinario')  {
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
      
      if (cargo === 'administrador'){
        await db.query(
          'INSERT INTO administradores (id_funcionarios) VALUES (?)',
          [result.insertId]
        );
      }
      await db.commit();
      res.status(201).send('Funcionário cadastrado com sucesso!');

    } catch (err) {
      await db.rollback();
      console.error('Erro ao cadastrar funcionário:', err);
      res.status(500).send('Erro ao cadastrar funcionário: ' + err.message);
    }
  }

  // Alterações na função atualizarFuncionario para atualizar corretamente os cargos e tabelas no banco de dados 
  export const atualizarFuncionario = async (req, res) => {
    const { id } = req.params;
  console.log('ID recebido para atualização:', id);
    const { nome, cpf, cargo, telefone, email, senha, crmv, especialidade } = req.body;

    if (!nome || !cpf || !cargo || !telefone || !email || !senha) {
      return res.status(400).send('Preencha todos os campos obrigatórios.');
    }

    try {
      await db.beginTransaction();

      // Busca o cargo atual no banco de dados
      const[func] = await db.query(
        'SELECT cargo FROM funcionarios WHERE id = ?', [id]
      );

      if(func.length === 0) {
        await db.rollback();
        return res.status(404).send('Funcionário não encontrado.');
      }

      const cargoAntigo = func[0].cargo;
      const senhaCriptografada = await bcrypt.hash(senha, 10);

      // Atualiza a tabela de funcionarios
      await db.query(
        'UPDATE funcionarios SET nome = ?, cpf = ?, cargo = ?, telefone = ?, email = ?, senha = ? WHERE id = ?',
        [nome, cpf, cargo, telefone, email, senhaCriptografada, id]
      );

      if (cargoAntigo !== cargo) {
        if(cargoAntigo === 'veterinario') {
          await db.query(
            'DELETE FROM veterinarios WHERE id_funcionarios = ?', 
            [id]
          );
        }
        if (cargoAntigo === 'administrador') {
          await db.query(
            'DELETE FROM administradores WHERE id_funcionarios = ?', [id]
          );
        }
      }

      // Se o cargo novo for veterinário, garante que está na tabela veterinário
      if (cargo === 'veterinario') {
        if(!crmv || !especialidade) {
          await db.rollback();
          return res.status(400).send('Preencha todos os campos obrigatórios para veterinários.');
        }

        const[vet] = await db.query(
          'SELECT * FROM veterinarios WHERE id_funcionarios = ?', [id]
        );

        if(vet.length === 0) {

          await db.query(
            'INSERT INTO veterinarios (id_funcionarios, crmv, especialidade) VALUES (?, ?, ?)',
            [id, crmv, especialidade]
          );
        } else {
          await db.query(
            'UPDATE veterinarios SET crmv = ?, especialidade = ? WHERE id_funcionarios = ?', 
            [crmv, especialidade, id]
          );
        }

      } else {
        // Se não for veterinário, garante que não existam dados residuais com seu id
        await db.query(
          'DELETE FROM veterinarios WHERE id_funcionarios = ?', [id]
        );
      }

      // Se o novo cargo for administrador, garante que está na tabela administrador
      if (cargo === 'administrador') {
        
        const[adm] = await db.query(
          'SELECT * FROM administradores WHERE id_funcionarios = ?', [id]
        );

        // Se não existe, então insere na tabela
        if(adm.length === 0) {
          await db.query(
            'INSERT INTO administradores (id_funcionarios) VALUES (?)', 
            [id]
          );
        }
      } else {
        // Se não for administrador, remove dados residuais na tabela administradores com seu id
        await db.query(
          'DELETE FROM administradores WHERE id_funcionarios = ?', 
          [id]
        );
      }

      await db.commit();
      res.send('Funcionário atualizado com sucesso!');
    } catch (err) {
      await db.rollback();
      console.error('Erro ao atualizar funcionário:', err);
      res.status(500).send('Erro ao atualizar funcionário.');
    }
  }

export const deletarFuncionario = async (req, res) => {
  const { id } = req.params;

  try {
    // Verifica se existe atendimento vinculado ao funcionário
    const [atendimentos] = await db.query(
      'SELECT id FROM atendimentos WHERE id_funcionarios = ? OR id_veterinario = ?',
      [id, id]
    );
    if (atendimentos.length > 0) {
      return res.status(400).send('Não é possível deletar: funcionário vinculado a atendimentos.');
    }

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

  const sql = `
    SELECT f.*, v.crmv, v.especialidade
    FROM funcionarios f
    LEFT JOIN veterinarios v ON f.id = v.id_funcionarios
    WHERE f.id = ?
  `;

  try {
    const [results] = await db.query(sql, [id]);
    if (results.length === 0) return res.status(404).send('Funcionário não encontrado.');
    res.json(results[0]);
  } catch (err) {
    console.error('Erro ao buscar funcionário:', err);
    res.status(500).send('Erro ao buscar funcionário.');
  }
};

export const listarVeterinarios = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT f.id, f.nome
      FROM veterinarios v
      JOIN funcionarios f ON v.id_funcionarios = f.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).send('Erro ao buscar veterinários.');
  }
};