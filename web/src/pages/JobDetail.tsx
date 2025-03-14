import { FC } from 'react';
import { Job } from '../types/Job';
import '../styles/JobDetail.css';

interface JobDetailProps {
  job: Job;
  onBackClick: () => void;
}

const JobDetail: FC<JobDetailProps> = ({ job, onBackClick }) => {
  return (
    <div className="page-container">
      <div className="job-details">
        <button className="back-button" onClick={onBackClick}>
          &larr; Back to all jobs
        </button>
        <h2>{job.title}</h2>
        <div className="job-company">{job.company}</div>
        <div className="job-location">{job.location}</div>
        <div className="job-salary">${job.salary.toLocaleString()}</div>
        <div className="job-posted">
          Posted: {new Date(job.postedDate).toLocaleDateString()}
        </div>
        <h3>Description</h3>
        <div className="job-description">{job.description}</div>
        {job.requirements && (
          <>
            <h3>Requirements</h3>
            <div className="job-requirements">{job.requirements}</div>
          </>
        )}
        {job.contactEmail && (
          <div className="job-contact">
            <h3>Contact</h3>
            <a href={`mailto:${job.contactEmail}`}>{job.contactEmail}</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail; 