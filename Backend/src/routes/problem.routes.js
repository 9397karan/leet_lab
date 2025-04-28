import {Router} from 'express'
import { authenticateUser, checkAdmin } from '../middleware/authenticate.middleware.js';
import { createProblem, deleteProblem, getAllProblems, getAllProblemsSolvedByUser, getProblemById, updateProblem } from '../controllers/problem.controller.js';
const route=Router()

route.post('/create-problem',authenticateUser,checkAdmin,createProblem)
route.get('/get-all-problems',authenticateUser,getAllProblems)
route.get('/get-problem/:id',authenticateUser,getProblemById)
route.put('/update-problem/:id',authenticateUser,checkAdmin,updateProblem)
route.delete('/delete-problem/:id',authenticateUser,checkAdmin,deleteProblem)
route.get('/get-solved-problems',authenticateUser,getAllProblemsSolvedByUser)
export default route;