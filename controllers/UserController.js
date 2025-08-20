import userModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import applicationModel from "../models/ApplicationModel.js";
import jobModel from "../models/JobModel.js";
import upload from "../config/multerSetup.js";
import fs from "fs";
import path from "path"
import { fileURLToPath } from 'url';



 const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadResume = async (req, res) => {
    try {
      // Use multer middleware to handle single file upload
      upload.single('resume')(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        }
  
        if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded' });
        }
  
        // Get user ID from request (e.g., from JWT or session)
        const userId = req.userId; // Replace with your auth mechanism
  
        // Update user with the resume file path
        const updatedUser = await userModel.findByIdAndUpdate(
          userId,
          { resume: path.join('uploads/resumes', req.file.filename) },
          { new: true }
        );
  
        if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
        }
  
        res.status(200).json({
          message: 'Resume uploaded successfully',
          resumePath: updatedUser.resume,
        });
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }


  const jobapplication = async (req, res) => {
    try {
        const userId = req.userId;         
        const { jobId } = req.params;

        if (jobId.length < 24) {
            return res.json({ success: false, message: 'Invalid path' });
        }

        const job = await jobModel.findById(jobId);
        if (!job) {
            return res.json({ success: false, message: 'No such Job Found' });
        }

        const existingApplication = await applicationModel.findOne({ userId, jobId });
        if (existingApplication) {
            return res.status(400).json({ msg: 'You have already applied to this job' });
        }

        // ✅ Get user details (resume)
        const user = await userModel.findById(userId).select("name resume");
        if (!user || !user.resume) {
            return res.status(400).json({ msg: "Resume not found. Please upload your resume first." });
        }

        const applicationData = {
            userId,
            jobId,
            resume: user.resume,   
            date: Date.now(),
        };

        const newApplication = new applicationModel(applicationData);
        await newApplication.save();

        res.json({ 
            success: true, 
            message: `Successfully Applied for Job Role: ${job.jobtitle} at ${job.companyName}`, 
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};



const myApplication = async (req, res) => {
    try {
        const userId = req.userId;

        const applicationdata = await applicationModel.find({ userId })
            .populate("userId", "name")                
            .populate("jobId", "jobtitle companyName") 
            .select("date");                           

        const applications = applicationdata.map(app => ({
            UserName: app.userId?.name,
            JobTitle: app.jobId?.jobtitle,
            CompanyName: app.jobId?.companyName,
            ApplicationDate: app.date
        }));

        res.json({ success: true, applications: applications });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};



const getResume = async (req, res) => {
  try {
    const userId = req.userId; 
    const user = await userModel.findById(userId);

    if (!user || !user.resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const resumePath = path.resolve(user.resume);

    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({ message: "Resume file missing on server" });
    }

    res.download(resumePath);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export {registerUser , loginUser, jobapplication, myApplication,uploadResume,getResume}