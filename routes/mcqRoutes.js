import express from 'express'

import {addMCQ,updateQues} from "../controllers/mcqController.js"

const router = express.Router()


router.post("/addmcq",addMCQ)
router.put('/updateques:id',updateQues)

export default router;
