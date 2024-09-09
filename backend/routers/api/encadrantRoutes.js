import { Router } from 'express';
import encadrantController from '@controllers/encadrantController.js';

const router = Router();

router.post('/', encadrantController.create);
router.get('/', encadrantController.getAll);
router.get('/:id', encadrantController.getById);
router.delete('/:id', encadrantController.deleteById);
router.put('/:id', encadrantController.updateById);


export default router;