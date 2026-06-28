import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import InterviewHistory from '../models/InterviewHistory.js';
import User from '../models/user.js';
import Groq from 'groq-sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pre-load massive fallback data into memory (backend loads it once instead of on every request)
let massiveFallbackQuestions = [];
try {
    const dataPath = path.join(__dirname, '../data/massiveFallbackQuestions.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    massiveFallbackQuestions = JSON.parse(rawData);
    console.log(`Loaded ${massiveFallbackQuestions.length} fallback questions into memory.`);
} catch (error) {
    console.error("Failed to load massiveFallbackQuestions.json:", error);
}

export const generateInterviewQuestions = async (req, res) => {
    try {
        const { category = 'Linux', difficulty = 'Medium' } = req.query;
        
        // 1. Check if user has uploaded a resume with extracted skills
        if (req.user) {
            const user = await User.findById(req.user._id);
            if (user && user.extractedSkills && user.extractedSkills.length > 0) {
                if (process.env.GROQ_API_KEY) {
                    try {
                        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
                        const prompt = `Generate exactly 20 multiple-choice technical interview questions about "${category}" with a "${difficulty}" difficulty level.
Crucially, tailor these questions to a candidate who has the following skills on their resume: ${user.extractedSkills.join(', ')}.
Output ONLY a valid JSON array of objects, with no markdown formatting or extra text.
Each object must have exactly these keys:
- "id": number
- "text": string (the question text)
- "difficulty": string ("${difficulty}")
- "topic": string ("${category}")
- "options": array of 4 string options
- "correctOptionIndex": number (0 to 3, representing the correct option)
- "section": "Technical"`;

                        const chatCompletion = await groq.chat.completions.create({
                            messages: [{ role: 'user', content: prompt }],
                            model: 'llama3-8b-8192',
                            temperature: 0.7,
                        });

                        const responseText = chatCompletion.choices[0]?.message?.content || "[]";
                        // Attempt to parse JSON. Sometimes Llama might wrap it in ```json ... ```
                        let jsonStr = responseText;
                        if (jsonStr.includes('```')) {
                            jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
                        }
                        
                        const generatedQuestions = JSON.parse(jsonStr);
                        if (Array.isArray(generatedQuestions) && generatedQuestions.length > 0) {
                            return res.status(200).json({ success: true, source: 'Resume-AI', data: generatedQuestions });
                        }
                    } catch (aiError) {
                        console.warn("Groq personalized generation failed, falling back to standard APIs.", aiError);
                    }
                }
            }
        }

        const apiKey = process.env.QUIZ_API_KEY;

        // Try to fetch from external QuizAPI
        if (apiKey) {
            const url = `https://quizapi.io/api/v1/questions?limit=20&category=${encodeURIComponent(category)}&difficulty=${encodeURIComponent(difficulty)}`;
            
            try {
                const response = await fetch(url, { headers: { 'X-Api-Key': apiKey } });
                if (response.ok) {
                    const data = await response.json();
                    
                    if (Array.isArray(data) && data.length > 0) {
                        // Transform to our internal format
                        const formatted = data.map((q, idx) => {
                            const validOptions = Object.values(q.answers).filter(val => val !== null);
                            const correctAnswersArr = Object.values(q.correct_answers);
                            const correctOptionIndex = correctAnswersArr.findIndex(val => val === "true" || val === true);

                            return {
                                id: q.id || idx,
                                text: q.question,
                                difficulty: q.difficulty || difficulty,
                                topic: q.category || category,
                                options: validOptions,
                                correctOptionIndex: correctOptionIndex !== -1 ? correctOptionIndex : 0,
                                section: "Technical"
                            };
                        });
                        return res.status(200).json({ success: true, source: 'QuizAPI', data: formatted });
                    }
                }
            } catch (apiError) {
                console.warn(`QuizAPI fetch failed for ${category}, falling back to massive internal JSON.`);
            }
        } else {
            console.warn("No QUIZ_API_KEY provided in backend environment. Defaulting to fallback JSON.");
        }

        const categoryList = category.split(',').map(c => c.trim().toLowerCase());

        // FALLBACK LOGIC
        // 1. Filter by category AND difficulty
        let filtered = massiveFallbackQuestions.filter(q => 
            categoryList.includes(q.topic?.toLowerCase()) &&
            q.difficulty?.toLowerCase() === difficulty.toLowerCase()
        );
        
        // 1b. If not enough questions, fallback to just filtering by category
        if (filtered.length < 20) {
            filtered = massiveFallbackQuestions.filter(q => 
                categoryList.includes(q.topic?.toLowerCase())
            );
        }

        // 2. If STILL too small (e.g. no questions for this topic), use whole bank
        const pool = filtered.length >= 20 ? filtered : massiveFallbackQuestions;
        
        // 3. Shuffle and pick exactly 20 random questions
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, 20).map(q => ({
            ...q,
            correctOptionIndex: q.correctOption !== undefined ? q.correctOption : 0,
            text: q.text.replace(/\s*\(Scenario \d+\)/, '')
        }));

        return res.status(200).json({ 
            success: true, 
            source: 'Fallback Bank', 
            data: selectedQuestions 
        });

    } catch (error) {
        console.error("Error generating interview questions:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const saveInterviewResult = async (req, res) => {
    try {
        const { category, difficulty, scorePercent, totalQuestions, answered, timeTakenSeconds, qna } = req.body;
        
        const result = await InterviewHistory.create({
            userId: req.user._id,
            category,
            difficulty,
            scorePercent,
            totalQuestions,
            answered,
            timeTakenSeconds,
            qna
        });

        res.status(201).json({ success: true, data: result });
    } catch (error) {
        console.error("Error saving interview result:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch user's interview history
        const history = await InterviewHistory.find({ userId }).sort({ createdAt: -1 });

        if (!history || history.length === 0) {
            return res.status(200).json({
                success: true,
                stats: {
                    interviewsDone: 0,
                    avgScore: 0,
                    bestCategory: '—',
                    practiceTimeMinutes: 0
                },
                recent: []
            });
        }

        // Calculate Stats
        const interviewsDone = history.length;
        const practiceTimeMinutes = Math.round(history.reduce((acc, curr) => acc + (curr.timeTakenSeconds || 0), 0) / 60);

        let totalQuestionsAttempted = 0;
        let totalCorrectAnswers = 0;

        history.forEach(h => {
            totalQuestionsAttempted += (h.answered || 0);
            if (h.qna && h.qna.length > 0) {
                totalCorrectAnswers += h.qna.filter(q => q.isCorrect).length;
            } else {
                // Rough fallback for older tests
                totalCorrectAnswers += Math.round(((h.scorePercent || 0) / 100) * (h.totalQuestions || 20));
            }
        });

        // Calculate Best Category & Chart Data
        const categoryScores = {};
        let totalInterviews = 0;
        history.forEach(h => {
            if (!categoryScores[h.category]) {
                categoryScores[h.category] = { totalScore: 0, count: 0 };
            }
            categoryScores[h.category].totalScore += h.scorePercent;
            categoryScores[h.category].count += 1;
            totalInterviews += 1;
        });

        let bestCategory = '—';
        let highestAvg = -1;
        const chartColors = [
            { color: '#3b82f6', bgClass: 'bg-blue-500' },
            { color: '#14b8a6', bgClass: 'bg-teal-500' },
            { color: '#eab308', bgClass: 'bg-yellow-500' },
            { color: '#f97316', bgClass: 'bg-orange-500' },
            { color: '#a855f7', bgClass: 'bg-purple-500' },
            { color: '#ec4899', bgClass: 'bg-pink-500' }
        ];

        let chartData = [];
        let colorIdx = 0;
        
        let totalPerformanceSum = 0;
        for (const [cat, data] of Object.entries(categoryScores)) {
            totalPerformanceSum += (data.totalScore / data.count);
        }

        for (const [cat, data] of Object.entries(categoryScores)) {
            const avg = data.totalScore / data.count;
            if (avg > highestAvg) {
                highestAvg = avg;
                bestCategory = cat;
            }

            const sliceSize = totalPerformanceSum > 0 ? Math.round((avg / totalPerformanceSum) * 100) : 0;
            chartData.push({
                title: cat,
                value: `${Math.round(avg)}%`, // Show the actual performance percentage
                rawValue: sliceSize, // Normalize for pie chart rendering
                ...chartColors[colorIdx % chartColors.length]
            });
            colorIdx++;
        }

        // Sort chartData descending by actual performance
        chartData.sort((a, b) => parseInt(b.value) - parseInt(a.value));
        
        // Cap at 5 slices, group the rest into "Other Subjects"
        if (chartData.length > 5) {
            const top4 = chartData.slice(0, 4);
            const others = chartData.slice(4);
            const othersRawValueSum = others.reduce((acc, curr) => acc + curr.rawValue, 0);
            const othersActualScoreAvg = Math.round(others.reduce((acc, curr) => acc + parseInt(curr.value), 0) / others.length);
            
            top4.push({
                title: 'Other Subjects',
                value: `${othersActualScoreAvg}%`,
                rawValue: othersRawValueSum,
                color: '#64748b',
                bgClass: 'bg-slate-500'
            });
            chartData = top4;
        }

        // Top 5 recent
        const recent = history.slice(0, 5).map(h => ({
            id: h._id,
            category: h.category,
            difficulty: h.difficulty,
            scorePercent: h.scorePercent,
            date: h.createdAt,
            timeTakenSeconds: h.timeTakenSeconds
        }));

        res.status(200).json({
            success: true,
            stats: {
                interviewsDone,
                totalCorrectAnswers,
                totalQuestionsAttempted,
                practiceTimeMinutes
            },
            chartData,
            recent
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ message: "Error fetching dashboard stats", error: error.message });
    }
};

// @desc    Get full interview history
// @route   GET /api/v1/interviews/history
// @access  Private
export const getFullHistory = async (req, res) => {
    try {
        const history = await InterviewHistory.find({ userId: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            history
        });
    } catch (error) {
        console.error("Fetch History Error:", error);
        res.status(500).json({ message: "Error fetching history", error: error.message });
    }
};

// @desc    Get details of a specific interview by ID
// @route   GET /api/v1/interviews/history/:id
// @access  Private
export const getInterviewDetails = async (req, res) => {
    try {
        const interviewId = req.params.id;
        const interview = await InterviewHistory.findOne({ _id: interviewId, userId: req.user._id });
        
        if (!interview) {
            return res.status(404).json({ success: false, message: 'Interview not found' });
        }
        
        res.status(200).json({ success: true, data: interview });
    } catch (error) {
        console.error("Error fetching interview details:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// @desc    Get questions from global bank
// @route   GET /api/v1/interviews/bank
// @access  Private
export const getQuestionBank = async (req, res) => {
    try {
        const { topic = '', search = '', limit = 20 } = req.query;
        let pool = massiveFallbackQuestions;
        
        if (topic && topic !== 'All') {
            const topicList = topic.split(',').map(t => t.trim().toLowerCase());
            pool = pool.filter(q => topicList.includes(q.topic?.toLowerCase()));
        }
        
        if (search) {
            const query = search.toLowerCase();
            pool = pool.filter(q => q.text.toLowerCase().includes(query) || (q.topic && q.topic.toLowerCase().includes(query)));
        }

        // Shuffle
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, parseInt(limit)).map(q => ({
            ...q,
            correctOptionIndex: q.correctOption !== undefined ? q.correctOption : 0,
            text: q.text.replace(/\s*\(Scenario \d+\)/, '')
        }));

        res.status(200).json({ success: true, data: selected });
    } catch (error) {
        console.error("Error in getQuestionBank:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// @desc    Global Omni-Search
// @route   GET /api/v1/interviews/search
// @access  Private
export const globalSearch = async (req, res) => {
    try {
        const { q = '' } = req.query;
        if (!q.trim()) return res.status(200).json({ success: true, data: { interviews: [], questions: [] } });

        const query = q.toLowerCase();

        // 1. Search past interviews by category
        const interviews = await InterviewHistory.find({ 
            userId: req.user._id, 
            category: { $regex: query, $options: 'i' } 
        }).sort({ createdAt: -1 }).limit(5);

        // 2. Search question bank text and category
        const questions = massiveFallbackQuestions
            .filter(qst => qst.text.toLowerCase().includes(query) || (qst.topic && qst.topic.toLowerCase().includes(query)))
            .slice(0, 5).map(q => ({
                id: q.id,
                text: q.text,
                topic: q.topic,
                difficulty: q.difficulty
            }));

        res.status(200).json({
            success: true,
            data: {
                interviews,
                questions
            }
        });
    } catch (error) {
        console.error("Error in globalSearch:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
