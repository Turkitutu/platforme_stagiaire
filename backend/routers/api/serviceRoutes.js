import { Router } from 'express';
import serviceController from '@controllers/serviceController.js';

const router = Router();

router.post('/', serviceController.create);
router.get('/', serviceController.getAll);
router.get('/:id', serviceController.getById);
router.delete('/:id', serviceController.deleteById);
router.put('/:id', serviceController.updateById);


export default router;