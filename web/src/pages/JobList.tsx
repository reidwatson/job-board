import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Job } from '../types/Job';
import { hasUserAppliedForJob } from '../services/applicationService';
import { getJobs } from '../services/jobService';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/JobList.css';

interface JobListProps {
  jobs?: Job[];
  onJobClick?: (job: Job) => void;
}

const JobList: FC<JobListProps> = ({ jobs: propJobs, onJobClick }) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>(propJobs || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicationStatus, setApplicationStatus] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (propJobs) {
      setJobs(propJobs);
      setLoading(false);
      return;
    }

    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await getJobs();
        console.log('Jobs response:', response);
        
        if (response && response.jobs) {
          setJobs(response.jobs);
        } else {
          setJobs([]);
          console.error('Invalid response format:', response);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs');
        setLoading(false);
      }
    };

    fetchJobs();
  }, [propJobs]);

  useEffect(() => {
    // Check application status for each job
    const checkApplicationStatus = async () => {
      if (!jobs || jobs.length === 0) return;
      
      const statusMap: Record<number, boolean> = {};
      
      for (const job of jobs) {
        if (!job || !job.id) continue;
        
        try {
          const hasApplied = await hasUserAppliedForJob(job.id);
          statusMap[job.id] = hasApplied;
        } catch (err) {
          console.error(`Error checking application status for job ${job.id}:`, err);
        }
      }
      
      setApplicationStatus(statusMap);
    };

    if (jobs && jobs.length > 0) {
      checkApplicationStatus();
    }
  }, [jobs]);

  const handleJobClick = (job: Job) => {
    if (onJobClick) {
      onJobClick(job);
    } else {
      navigate(`/jobs/${job.id}`);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading jobs..." />;
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Recent Jobs</h1>
          <p className="page-subtitle">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Recent Jobs</h1>
          <p className="page-subtitle">Browse the latest job opportunities</p>
        </div>
        <p className="no-jobs">No jobs found.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Recent Jobs</h1>
        <p className="page-subtitle">Browse the latest job opportunities</p>
      </div>
      
      <div className="jobs-grid">
        {jobs && jobs.map(job => (
          job && (
            <div 
              key={job.id} 
              className="job-card" 
              onClick={() => handleJobClick(job)}
            >
              <div className="job-card-content">
                <h2 className="job-title">{job.title}</h2>
                <div className="job-company">{job.company}</div>
                <div className="job-location">{job.location}</div>
                <div className="job-salary">
                  ${job.minSalary && job.maxSalary 
                    ? `${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}`
                    : job.salary?.toLocaleString() || 'Not specified'}
                </div>
                <div className="job-posted">
                  Posted: {new Date(job.createdAt || job.postedDate).toLocaleDateString()}
                </div>
                
                {applicationStatus[job.id] && (
                  <div className="job-applied-badge">
                    <span className="applied-icon">✓</span> Applied
                  </div>
                )}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default JobList; 