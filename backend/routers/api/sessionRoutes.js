import express from 'express';
import { getSession, upsertSession, toggleSession } from '@controllers/sessionController.js';

const router = express.Router();

router.get('/', getSession);
router.post('/upsert', upsertSession);
router.post('/toggle', toggleSession);

export default router;
