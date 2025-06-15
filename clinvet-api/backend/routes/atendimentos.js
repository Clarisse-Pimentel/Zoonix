import express from 'express';

import {
  listarAtendimentos,
  cadastrarAtendimento,
  atualizarAtendimento,
  deletarAtendimento,
  buscarAtendimentoPorId
} from '../controllers/atendimentosController.js';

const router = express.Router();
router.get('/', listarAtendimentos);
router.post('/', cadastrarAtendimento);
router.put('/:id', atualizarAtendimento);
router.delete('/:id', deletarAtendimento);
router.get('/:id', buscarAtendimentoPorId);

export default router;
// O código acima define as rotas para gerenciar atendimentos na aplicação.