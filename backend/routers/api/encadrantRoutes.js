import { Router } from 'express';
import encadrantController from '@controllers/encadrantController.js';
import auth from '@middlewares/auth.js';

const router = Router();

router.post('/', auth, encadrantController.create);
router.delete('/:id', auth, encadrantController.deleteById);
router.put('/:id', auth, encadrantController.updateById);

router.get('/', auth, encadrantController.getAll);
router.get('/:id', auth, encadrantController.getById);

export default router;