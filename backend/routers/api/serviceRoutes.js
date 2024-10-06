import { Router } from 'express';
import serviceController from '@controllers/serviceController.js';
import auth from '@middlewares/auth.js';

const router = Router();
router.get('/', auth, serviceController.getAll);
router.get('/:id', auth, serviceController.getById);

router.post('/', auth, serviceController.create);
router.delete('/:id', auth, serviceController.deleteById);
router.put('/:id', auth, serviceController.updateById);


export default router;