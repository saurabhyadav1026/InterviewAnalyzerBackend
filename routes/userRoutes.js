import express from 'express';
import multer from 'multer';
import { protect } from '../middlewares/authMiddleware.js';
import { getUserProfile, updateProfile, updatePassword, deleteAccount, uploadResume } from '../controllers/userController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.delete('/account', protect, deleteAccount);
router.post('/resume', protect, upload.single('resume'), uploadResume);

export default router;
