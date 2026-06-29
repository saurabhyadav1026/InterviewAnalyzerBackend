import express from 'express'

import {addMCQ,updateQues,deleteQues} from "../controllers/mcqController.js"
import adminMiddleware from '../middlewares/adminMiddleware.js'

const router = express.Router()


router.post("/addmcq",addMCQ)
router.put('/updatemcq/:id',adminMiddleware,updateQues)
router.delete("/deletemcq/:id",adminMiddleware,deleteQues)
export default router;
