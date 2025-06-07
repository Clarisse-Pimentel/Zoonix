import express from 'express';
import {
  listarPacientes,
  cadastrarPaciente,
  atualizarPaciente,
  deletarPaciente
} from '../controllers/pacientesController.js';

const router = express.Router();

router.get('/', listarPacientes);
router.post('/', cadastrarPaciente);
router.put('/:id', atualizarPaciente);
router.delete('/:id', deletarPaciente);

export default router;

import { buscarPacientePorId } from '../controllers/pacientesController.js';

router.get('/:id', buscarPacientePorId);
