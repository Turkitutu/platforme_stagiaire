import { Router } from 'express';
import userController from '@controllers/userController.js';

const router = Router();

router.get('/', userController.getAll);
router.post('/', userController.create);
router.delete('/:id', userController.deleteById);
router.put('/:id', userController.updateById);

export default router;