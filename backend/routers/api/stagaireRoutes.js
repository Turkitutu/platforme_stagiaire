import { Router } from 'express';
import stagaireController from '@controllers/stagaireController.js';
import auth from '@middlewares/auth.js';

const router = Router();

router.get('/', auth, stagaireController.getAll);
router.get('/:id', auth, stagaireController.getById);


router.delete('/:id', auth, stagaireController.deleteById);
router.put('/:id', auth, stagaireController.updateById);


export default router;