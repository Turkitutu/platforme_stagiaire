import { Router } from 'express';
import studentDemandController from '@controllers/studentDemandController.js';
import upload from '@middlewares/multer.js';

const router = Router();

router.post('/', upload.array('attachments', 3), studentDemandController.create);

export default router;