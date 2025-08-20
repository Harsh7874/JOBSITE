import jobModel from "../models/JobModel.js"

const jobList = async (res) => {
    try {

        const jobs = await jobModel.find({})
        res.json({ success: true, jobs })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

export {jobList}