import {db} from '../db.js';

export const login = async (req, res) => {
    const {cpf, senha} = req.body;

    if (!cpf || !senha) {
        return res.status(400).send('Preencha todos os campos obrigatórios.');
    }

    try {
        const [rows] = await db.query(
            'SELECT * FROM funcionarios WHERE cpf = ? AND senha = ?',
            [cpf, senha]
        );

        if (rows.length === 0) {
            return res.status(401).send('Nome de usuário ou senha incorretos.');
        }

        const funcionario = rows[0];
        res.status(200).json({
            id: funcionario.id,
            nome: funcionario.nome,
            cpf: funcionario.cpf,
            email: funcionario.email,
            cargo: funcionario.cargo,
            "mensagem": 'Login realizado com sucesso!'
        }); 
    }catch (err) {
            console.error(err);
            res.status(500).send('Erro ao realizar login.');
        }

    };
