import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById } from '../services/jobService';
import { formatSalary, formatDate } from '../utils/formatters';
import { Job } from '../types/Job';
import { applyForJob, hasUserAppliedForJob } from '../services/applicationService';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/JobDetail.css';

interface JobDetailProps {
  job?: Job;
  onBackClick?: () => void;
}

const JobDetail: React.FC<JobDetailProps> = ({ job: propJob, onBackClick }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
        if (!id) return;
        const data = await getJobById(parseInt(id));
        setJob(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load job details');
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, propJob]);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      if ((!id && !job)) return;
      
      try {
        const jobId = id ? parseInt(id) : job?.id;
        if (!jobId) return;
        
        const applied = await hasUserAppliedForJob(jobId);
        setHasApplied(applied);
      } catch (err) {
        console.error('Error checking application status:', err);
      }
    };

    checkApplicationStatus();
  }, [id, job]);

  const handleApply = async () => {
    if (!id && !job) return;
    const jobId = id ? parseInt(id) : job?.id;
    if (!jobId) return;

    setApplying(true);
    setMessage(null);

    try {
      const response = await applyForJob(jobId);
      
      if (response.success) {
        setHasApplied(true);
        setMessage({ text: 'Application submitted successfully!', type: 'success' });
      } else {
        setMessage({ text: response.message || 'Failed to submit application', type: 'error' });
      }
    } catch (err) {
      console.error('Error applying for job:', err);
      setMessage({ text: 'Failed to submit application. Please try again.', type: 'error' });
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
    return <div className="error">{error || 'Job not found'}</div>;
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
            <div className="job-posted">Posted {formatDate(job.createdAt)}</div>
          </div>
          
          <div className="job-actions">
            {hasApplied ? (
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