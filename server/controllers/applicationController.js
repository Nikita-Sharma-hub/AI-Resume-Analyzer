import { getApplicationsByUser } from '../models/Application.js';
import User from '../models/User.js';
import Resume from '../models/Resume.js';

// Get all applications for the current user
export async function getMyApplications(req, res) {
  try {
    const userId = req.user.id;
    const applications = await getApplicationsByUser(userId);

    res.json({
      success: true,
      data: applications || []
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
}

// Get candidate details for recruiters viewing applicants
export async function getCandidateDetails(req, res) {
  try {
    const { candidateId } = req.params;

    // Get candidate user details
    const candidate = await User.findById(candidateId).select('-password');
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    // Get candidate's resumes
    const resumes = await Resume.find({ user: candidateId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        candidate,
        resume: resumes[0] || null, // Return the most recent resume
        allResumes: resumes
      }
    });
  } catch (error) {
    console.error('Error fetching candidate details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch candidate details',
      error: error.message
    });
  }
}

// Apply to a job
export async function applyToJob(req, res) {
  try {
    const { jobId, resumeId } = req.body;
    const userId = req.user.id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if resume exists and belongs to user
    const resume = await Resume.findOne({ _id: resumeId, user: userId });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found or does not belong to user'
      });
    }

    // Check if user has already applied to this job
    const existingApplication = await Application.findOne({
      userId,
      jobId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job'
      });
    }

    // Calculate match score based on resume analysis and job requirements
    let matchScore = 0;
    if (resume.analysis && resume.analysis.score && job.aiAnalysis) {
      // Simple scoring logic - can be enhanced with AI
      const resumeScore = resume.analysis.score || 0;
      const requiredSkills = job.aiAnalysis.requiredSkills || [];
      const resumeSkills = resume.analysis.extractedSkills || [];

      const skillMatches = requiredSkills.filter(skill =>
        resumeSkills.some(rSkill => rSkill.toLowerCase().includes(skill.toLowerCase()))
      ).length;

      const skillMatchPercentage = requiredSkills.length > 0
        ? (skillMatches / requiredSkills.length) * 50
        : 25;

      matchScore = Math.round((resumeScore * 0.5) + skillMatchPercentage);
    }

    // Create application
    const application = await Application.create({
      userId,
      jobId,
      resumeId,
      matchScore: Math.min(matchScore, 100),
      status: 'pending'
    });

    // Populate application details
    const populatedApplication = await Application.findById(application._id)
      .populate('userId', 'name email')
      .populate('jobId', 'title company location')
      .populate('resumeId', 'fileName fileUrl');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: populatedApplication
    });

  } catch (error) {
    console.error('Error applying to job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
}

// Get job applicants (for recruiters)
export async function getJobApplicants(req, res) {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    // Check if job exists and belongs to recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.postedBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applicants for this job'
      });
    }

    // Get all applications for this job
    const applications = await Application.find({ jobId })
      .populate('userId', 'name email location')
      .populate('resumeId', 'fileName fileUrl analysis')
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      data: {
        job: {
          _id: job._id,
          title: job.title,
          company: job.company,
          location: job.location
        },
        applicants: applications
      }
    });

  } catch (error) {
    console.error('Error fetching job applicants:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job applicants',
      error: error.message
    });
  }
}
