import { Router } from 'express';
import studentDemandController from '@controllers/studentDemandController.js';
import upload from '@middlewares/multer.js';
import auth from '@middlewares/auth.js';

const router = Router();

router.get('/', auth, studentDemandController.getAll);
router.post('/accept/:id', auth, studentDemandController.accept);
router.post('/reject/:id', auth, studentDemandController.reject)

router.post('/', upload.array('attachments', 3), studentDemandController.create);


router.get('/verify/:studentID', studentDemandController.verify);

export default router;