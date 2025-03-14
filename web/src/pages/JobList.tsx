import { FC } from 'react';
import { Job } from '../types/Job';
import '../styles/JobList.css';

interface JobListProps {
  jobs: Job[];
  onJobClick: (job: Job) => void;
}

const JobList: FC<JobListProps> = ({ jobs, onJobClick }) => {
  if (jobs.length === 0) {
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
        {jobs.map(job => (
          <div 
            key={job.id} 
            className="job-card" 
            onClick={() => onJobClick(job)}
          >
            <div className="job-card-content">
              <h2 className="job-title">{job.title}</h2>
              <div className="job-company">{job.company}</div>
              <div className="job-location">{job.location}</div>
              <div className="job-salary">${job.salary.toLocaleString()}</div>
              <div className="job-posted">
                Posted: {new Date(job.postedDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobList; 