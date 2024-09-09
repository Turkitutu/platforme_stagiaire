import { Router } from 'express';
import authRoutes from './authRoutes.js';
import etablissementRoutes from './etablissementRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import demandeStageRoutes from './demandeStageRoutes.js';

const router = Router();

router.use('/auth', authRoutes);

router.use('/etablissement', etablissementRoutes);
router.use('/service', serviceRoutes);
router.use('/demande_stage', demandeStageRoutes);



export default router;