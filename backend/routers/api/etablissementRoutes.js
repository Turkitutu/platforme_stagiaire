import { Router } from 'express';
import etablissementController from '@controllers/etablissementController.js';

const router = Router();

router.post('/', etablissementController.create);
router.get('/', etablissementController.getAll);
router.get('/:id', etablissementController.getById);
router.delete('/:id', etablissementController.deleteById);
router.put('/:id', etablissementController.updateById);


export default router;