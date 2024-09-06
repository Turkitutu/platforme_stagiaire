import { Router } from 'express';
import authRoutes from './authRoutes.js';
import etablissementRoutes from './etablissementRoutes.js';
import serviceRoutes from './serviceRoutes.js';

const router = Router();

router.use('/auth', authRoutes);

router.use('/etablissement', etablissementRoutes);
router.use('/service', serviceRoutes);


export default router;