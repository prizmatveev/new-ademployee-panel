import express from 'express';
import mongoose from 'mongoose';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import User from '../models/User.js';

const router = express.Router();

// GET /api/admin/jobs - Get all jobs ordered newest first
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// POST /api/admin/jobs - Create a new job (useful for testing/seeding)
router.post('/jobs', async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      location,
      salary,
      experience,
      employmentType,
      skills,
      customQuestions,
      openings,
      isOpen
    } = req.body;

    const job = new Job({
      title,
      category,
      description,
      location,
      salary,
      experience,
      employmentType,
      skills: skills || [],
      customQuestions: customQuestions || [],
      openings: openings || 1,
      isOpen: isOpen !== undefined ? isOpen : true
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// GET /api/admin/applications - Get all applications ordered newest first
router.get('/applications', async (req, res) => {
  try {
    // Populate user and job
    const applications = await Application.find({})
      .populate('userId', 'name email role')
      .populate('jobId', 'title category')
      .sort({ createdAt: -1 });

    // Format output to match client expectation (user and job objects directly populated)
    const formatted = applications.map(app => {
      const appObj = app.toJSON();
      return {
        ...appObj,
        // Fallbacks in case user or job is not populated
        user: appObj.userId || { name: 'Unknown User', email: 'unknown@localsm.com' },
        job: appObj.jobId || { title: 'Unknown Job', category: 'General' }
      };
    });

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// POST /api/admin/applications - Create a new application (useful for testing/seeding)
router.post('/applications', async (req, res) => {
  try {
    const {
      userId,
      jobId,
      resume,
      linkedin,
      github,
      portfolio,
      phone,
      location,
      yearsExperience,
      currentCompany,
      expectedSalary,
      coverLetter,
      status
    } = req.body;

    // Verify user and job exist
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const jobExists = await Job.findById(jobId);
    if (!jobExists) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const application = new Application({
      userId,
      jobId,
      resume: resume || '',
      linkedin: linkedin || '',
      github: github || '',
      portfolio,
      phone,
      location,
      yearsExperience,
      currentCompany,
      expectedSalary,
      coverLetter,
      status: status || 'PENDING'
    });

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: 'Failed to create application' });
  }
});

// PATCH /api/admin/jobs/:id - Update an existing job
router.patch('/jobs/:id', async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      location,
      salary,
      experience,
      employmentType,
      skills,
      customQuestions,
      openings,
      isOpen
    } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (location !== undefined) updateData.location = location;
    if (salary !== undefined) updateData.salary = salary;
    if (experience !== undefined) updateData.experience = experience;
    if (employmentType !== undefined) updateData.employmentType = employmentType;
    if (skills !== undefined) {
      updateData.skills = Array.isArray(skills) ? skills.map(s => String(s || '').trim()).filter(Boolean) : [];
    }
    if (customQuestions !== undefined) {
      updateData.customQuestions = Array.isArray(customQuestions) 
        ? Array.from(new Set(customQuestions.map(q => String(q || '').trim()).filter(Boolean)))
        : [];
    }
    if (openings !== undefined) {
      const openingsVal = Number(openings);
      updateData.openings = Number.isFinite(openingsVal) && openingsVal > 0 ? Math.floor(openingsVal) : 1;
    }
    if (isOpen !== undefined) updateData.isOpen = !!isOpen;

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// DELETE /api/admin/jobs/:id - Delete a job and its applications
router.delete('/jobs/:id', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const jobId = req.params.id;

    // 1. Delete all applications related to this job
    await Application.deleteMany({ jobId }).session(session);

    // 2. Delete the job
    const job = await Job.findByIdAndDelete(jobId).session(session);

    if (!job) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Job not found' });
    }

    await session.commitTransaction();
    session.endSession();
    res.json({ ok: true });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

export default router;
