import {Router} from "express"
import { check, login, logout, register } from "../controllers/auth.controller.js"
import { authenticateUser } from "../middleware/authenticate.middleware.js";

const router=Router()

router.post('/register',register);
router.post('/login',login);
router.post('/logout',logout);
router.get('/check',authenticateUser,check);

export default router