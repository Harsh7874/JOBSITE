import express from 'express'
import {registerUser, loginUser, jobapplication, myApplication, uploadResume, getResume} from '../controllers/UserController.js'
import authUser from '../middleware/AuthUser.js'

const userRouter =  express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.post("/resume/upload",authUser,uploadResume)
userRouter.post("/jobs/apply/:jobId",authUser,jobapplication)
userRouter.get("/myapplication",authUser,myApplication)
userRouter.get("/myresume",authUser,getResume)

export default userRouter