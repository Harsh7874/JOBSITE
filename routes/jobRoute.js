import { jobList } from "../controllers/jobController.js";
import express from "express"
import authUser from "../middleware/AuthUser.js";

const jobRouter = express.Router();

jobRouter.get("/list",authUser,jobList);
jobRouter.get("/alljob",jobList);

export default jobRouter