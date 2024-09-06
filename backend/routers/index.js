import { Router } from 'express';
import api from '@routers/api/index.js';

const router = Router();

router.use('/api', api);

export default router;