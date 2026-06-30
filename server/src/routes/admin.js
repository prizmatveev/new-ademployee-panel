import express from 'express';
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

export default router;
