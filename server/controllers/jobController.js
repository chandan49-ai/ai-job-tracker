const Job = require("../models/Job");

// CREATE JOB
const createJob = async (req, res) => {
  try {
    const {
      company,
      position,
      location,
      status,
      jobUrl,
      notes,
      appliedDate,
    } = req.body;

    if (!company || !position) {
      return res.status(400).json({
        success: false,
        message: "Company and position are required",
      });
    }

    const job = await Job.create({
      user: req.userId,
      company,
      position,
      location,
      status,
      jobUrl,
      notes,
      appliedDate,
    });

    res.status(201).json({
      success: true,
      message: "Job added successfully",
      job,
    });
  } catch (error) {
    console.error("Create job error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET MY JOBS
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      user: req.userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// UPDATE JOB
const updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const {
      company,
      position,
      location,
      status,
      jobUrl,
      notes,
      appliedDate,
    } = req.body;

    if (company !== undefined) job.company = company;
    if (position !== undefined) job.position = position;
    if (location !== undefined) job.location = location;
    if (status !== undefined) job.status = status;
    if (jobUrl !== undefined) job.jobUrl = jobUrl;
    if (notes !== undefined) job.notes = notes;
    if (appliedDate !== undefined) job.appliedDate = appliedDate;

    await job.save();

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error("Update job error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// DELETE JOB
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete job error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
};