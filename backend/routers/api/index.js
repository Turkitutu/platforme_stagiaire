import { Router } from 'express';
import authRoutes from './authRoutes.js';
import etablissementRoutes from './etablissementRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import demandeStageRoutes from './demandeStageRoutes.js';
import encadrantRoutes from './encadrantRoutes.js';
import stagaireRoutes from './stagaireRoutes.js';
import userRoutes from './userRoutes.js';
import sessionRoutes from './sessionRoutes.js';

import auth from '@middlewares/auth.js';


const router = Router();

router.use('/auth', authRoutes);


router.use('/encadrant', encadrantRoutes);
router.use('/demande_stage', demandeStageRoutes);
router.use('/etablissement', etablissementRoutes);
router.use('/service', serviceRoutes);
router.use('/stagaire', stagaireRoutes);

router.use('/session', sessionRoutes);
router.use('/user', auth, userRoutes);


export default router;