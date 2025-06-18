import express from 'express';
import {
  listarPacientes,
  cadastrarPaciente,
  atualizarPaciente,
  deletarPaciente,
  buscarPacientePorId
} from '../controllers/pacientesController.js';

const router = express.Router();

router.get('/', listarPacientes);
router.post('/', cadastrarPaciente);
router.put('/:id', atualizarPaciente);
router.delete('/:id', deletarPaciente);
router.get('/:id', buscarPacientePorId);

export default router;



