import { Router } from 'express';
import authRoutes from './authRoutes.js';
import etablissementRoutes from './etablissementRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import demandeStageRoutes from './demandeStageRoutes.js';
import encadrantRoutes from './encadrantRoutes.js';
import stagaireRoutes from './stagaireRoutes.js';


const router = Router();

router.use('/auth', authRoutes);


router.use('/encadrant', encadrantRoutes);
router.use('/demande_stage', demandeStageRoutes);
router.use('/etablissement', etablissementRoutes);
router.use('/service', serviceRoutes);
router.use('/stagaire', stagaireRoutes);


export default router;