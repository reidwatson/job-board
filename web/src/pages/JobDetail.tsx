import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById } from '../services/jobService';
import { formatSalary, formatDate } from '../utils/formatters';
import { Job } from '../types/Job';
import { applyForJob, hasUserAppliedForJob } from '../services/applicationService';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import '../styles/JobDetail.css';

interface JobDetailProps {
  job?: Job;
  onBackClick?: () => void;
}

const JobDetail: React.FC<JobDetailProps> = ({ job: propJob, onBackClick }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(propJob || null);
  const [loading, setLoading] = useState(!propJob);
  const [error, setError] = useState<string | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    // If job is provided via props, use that
    if (propJob) {
      setJob(propJob);
      setLoading(false);
      return;
    }
    
    // Otherwise fetch job by ID from URL
    const fetchJob = async () => {
      try {
        if (!id) {
          setError('No job ID provided');
          setLoading(false);
          return;
        }
        
        console.log('Fetching job with ID:', id);
        const jobId = parseInt(id);
        
        if (isNaN(jobId)) {
          setError('Invalid job ID');
          setLoading(false);
          return;
        }
        
        const data = await getJobById(jobId);
        
        if (!data) {
          setError('Job not found');
          setLoading(false);
          return;
        }
        
        console.log('Job data received:', data);
        setJob(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to load job details');
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, propJob]);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      if ((!id && !job) || !user) return;
      
      try {
        const jobId = id ? parseInt(id) : job?.id;
        if (!jobId || isNaN(jobId)) return;
        
        const applied = await hasUserAppliedForJob(jobId);
        setHasApplied(applied);
      } catch (err) {
        console.error('Error checking application status:', err);
      }
    };

    checkApplicationStatus();
  }, [id, job, user]);

  const handleApply = async () => {
    if (!user) {
      navigate('/auth', { state: { from: location.pathname } });
      return;
    }

    if (!id && !job) return;
    const jobId = id ? parseInt(id) : job?.id;
    if (!jobId || isNaN(jobId)) return;

    setApplying(true);
    setMessage(null);

    try {
      const response = await applyForJob(jobId);
      
      if (response && response.success) {
        setHasApplied(true);
        setMessage({ text: 'Application submitted successfully!', type: 'success' });
      } else {
        setMessage({ 
          text: response?.message || 'Failed to submit application', 
          type: 'error' 
        });
      }
    } catch (err) {
      console.error('Error applying for job:', err);
      let errorMessage = 'Failed to submit application. Please try again.';
      
      if (err instanceof Error && err.message.includes('Authentication required')) {
        errorMessage = 'Please log in to apply for this job';
        // Optionally redirect to login page
        // navigate('/auth');
      }
      
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setApplying(false);
    }
  };

  const handleBackButton = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading job details..." />;
  }

  if (error || !job) {
    return (
      <div className="container">
        <button className="back-button" onClick={handleBackButton}>
          ← Back to Jobs
        </button>
        <div className="error-container">
          <div className="error">{error || 'Job not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <button className="back-button" onClick={handleBackButton}>
        ← Back to Jobs
      </button>
      
      <div className="job-details">
        <div className="job-header">
          <div className="job-header-content">
            <h2>{job.title}</h2>
            <div className="job-company">{job.company}</div>
            <div className="job-location">{job.location}</div>
            <div className="job-salary">{formatSalary(job.minSalary, job.maxSalary)}</div>
            <div className="job-posted">Posted {formatDate(job.createdAt || job.postedDate)}</div>
          </div>
          
          <div className="job-actions">
            {user ? (
              hasApplied ? (
                <button className="applied-button" disabled>
                  <span className="applied-icon">✓</span> Applied
                </button>
              ) : (
                <button 
                  className="apply-button" 
                  onClick={handleApply} 
                  disabled={applying}
                >
                  {applying ? 'Applying...' : 'Apply Now'}
                </button>
              )
            ) : (
              <button 
                className="apply-button" 
                onClick={() => navigate('/auth', { state: { from: location.pathname } })}
              >
                Sign in to Apply
              </button>
            )}
          </div>
        </div>
        
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <h3>Job Description</h3>
        <div className="job-description">{job.description}</div>

        {job.requirements && (
          <>
            <h3>Requirements</h3>
            <div className="job-requirements">{job.requirements}</div>
          </>
        )}

        {job.contactEmail && (
          <div className="job-contact">
            <h3>Contact Information</h3>
            <p>
              For more information: <a href={`mailto:${job.contactEmail}`}>{job.contactEmail}</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail; 