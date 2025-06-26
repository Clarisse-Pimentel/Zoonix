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
router.post('/', authMiddleware,permitirAcesso(['administrador', 'veterinario']), cadastrarAtendimento);
// Apenas  veterinários podem editar os dados dos atendimentos.
router.put('/:id', authMiddleware, permitirAcesso(['veterinario']), atualizarAtendimento);
router.delete('/:id', authMiddleware, permitirAcesso(['administrador', 'veterinario']), deletarAtendimento);
router.get('/:id', authMiddleware, permitirAcesso(['administrador', 'veterinario']), buscarAtendimentoPorId);

export default router;

