import { Router } from 'express';
import etablissementController from '@controllers/etablissementController.js';
import auth from '@middlewares/auth.js';

const router = Router();

router.post('/', auth, etablissementController.create);
router.delete('/:id', auth, etablissementController.deleteById);
router.put('/:id', auth, etablissementController.updateById);

router.get('/', etablissementController.getAll);
router.get('/:id', etablissementController.getById);
export default router;