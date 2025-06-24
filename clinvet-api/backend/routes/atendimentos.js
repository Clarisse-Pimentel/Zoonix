import express from 'express';

import {
  listarAtendimentos,
  cadastrarAtendimento,
  atualizarAtendimento,
  deletarAtendimento,
  buscarAtendimentoPorId
} from '../controllers/atendimentosController.js';
import { authMiddleware } from '../middleware/autenticacao-jwt.js';
import { permitirAcesso } from '../middleware/permissao.js';

const router = express.Router();
router.get('/', listarAtendimentos);
router.post('/', cadastrarAtendimento);
// Apenas administradores e veterinários podem editar os dados dos atendimentos.
router.put('/:id', authMiddleware, permitirAcesso(['administrador', 'veterinario']), atualizarAtendimento);
router.delete('/:id', deletarAtendimento);
router.get('/:id', buscarAtendimentoPorId);

export default router;
// O código acima define as rotas para gerenciar atendimentos na aplicação.
