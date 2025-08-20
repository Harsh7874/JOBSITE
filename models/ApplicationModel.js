import mongoose from 'mongoose'
import { type } from 'os'

const applicationSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.ObjectId,ref:"user",required:true},
    jobId:{type:mongoose.Schema.ObjectId,ref:"job",required:true},
    applicationStatus:{type:String,enum: ["none", "pending", "applied", "viewed"],default:"none"},
    resume:{type:String},
    date:{type:Date}
},{ timestamps: true }
)

const applicationModel = mongoose.models.application || mongoose.model("application",applicationSchema)

export default applicationModel