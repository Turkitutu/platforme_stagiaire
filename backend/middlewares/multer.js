import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const originalName = file.originalname;
        const uniqueName = `${timestamp}-${originalName}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

export default upload;