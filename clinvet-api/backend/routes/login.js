import express from 'express';
import {login} from '../controllers/loginController.js';
import {verificarPrimeiroAcesso} from '../controllers/loginController.js';


const router = express.Router();
router.post('/', login);

export { verificarPrimeiroAcesso };

export default router;








