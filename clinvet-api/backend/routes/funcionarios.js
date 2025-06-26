import express from 'express';
import {
  listarFuncionarios,
  cadastrarFuncionario,
  atualizarFuncionario,
  deletarFuncionario,
  buscarFuncionarioPorId,
  listarVeterinarios
} from '../controllers/funcionariosController.js';

import { authMiddleware } from '../middleware/autenticacao-jwt.js';
import { permitirAcesso } from '../middleware/permissao.js';

const router = express.Router();

// Todas as rotas de funcionários exigem: usuário autenticado + cargo admin


router.get('/veterinarios', authMiddleware, permitirAcesso(['administrador', 'veterinario']), listarVeterinarios);
router.get('/', authMiddleware, permitirAcesso(['administrador', 'veterinario']), listarFuncionarios);
router.post('/', cadastrarFuncionario);
router.put('/:id', atualizarFuncionario);
router.delete('/:id', deletarFuncionario);
router.get('/:id', buscarFuncionarioPorId);


export default router;
