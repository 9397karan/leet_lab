import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
dotenv.config();

//import routes
import authRoutes from './routes/auth.routes.js'
import problemRoutes from "./routes/problem.routes.js"
 const app=express();
app.use(express.json());
app.use(cookieParser())


app.use('/api/v1/user',authRoutes);
app.use('/api/v1/problem',problemRoutes);


 app.listen(process.env.PORT,()=>{
    console.log('Listing port',process.env.PORT)
 })