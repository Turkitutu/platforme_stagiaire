import { Router } from 'express';
import authRoutes from './authRoutes.js';
import etablissementRoutes from './etablissementRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import demandeStageRoutes from './demandeStageRoutes.js';
import encadrantRoutes from './encadrantRoutes.js';

const router = Router();

router.use('/auth', authRoutes);

router.use('/etablissement', etablissementRoutes);
router.use('/service', serviceRoutes);
router.use('/demande_stage', demandeStageRoutes);
router.use('/encadrant', encadrantRoutes);



export default router;