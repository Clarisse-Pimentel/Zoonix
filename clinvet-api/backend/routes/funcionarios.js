import expreess from 'express';
import {
  listarFuncionarios,
  cadastrarFuncionario,
  atualizarFuncionario,
  deletarFuncionario,
  buscarFuncionarioPorId
} from '../controllers/funcionariosController.js';

const router = expreess.Router();
router.get('/', listarFuncionarios);
router.post('/', cadastrarFuncionario);
router.put('/:id', atualizarFuncionario);
router.delete('/:id', deletarFuncionario);
router.get('/:id', buscarFuncionarioPorId);

export default router;
// O código acima define as rotas para gerenciar funcionários na aplicação.

