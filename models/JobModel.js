import mongoose from "mongoose"

const jobSchema = new mongoose.Schema({
    jobtitle:{ type:String},
    companyName:{type:String},
    pay:{type: Number },
    experience:{ type: Number }}
  )

const jobModel = mongoose.model.job || mongoose.model("job", jobSchema);
export default jobModel;