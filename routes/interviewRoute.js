import express from 'express';
import { generateInterviewQuestions, saveInterviewResult, getDashboardStats, getFullHistory, getInterviewDetails, getQuestionBank, globalSearch } from '../controllers/interviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protected routes for generating questions, history and dashboard
router.get('/questions', protect, generateInterviewQuestions);

// Protected routes for history and dashboard
router.post('/history', protect, saveInterviewResult);
router.get('/history', protect, getFullHistory);
router.get('/history/:id', protect, getInterviewDetails);
router.get('/dashboard', protect, getDashboardStats);

// New Routes
router.get('/bank', protect, getQuestionBank);
router.get('/search', protect, globalSearch);

export default router;
