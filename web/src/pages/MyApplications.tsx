import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserApplications } from '../services/applicationService';
import { getJobById } from '../services/jobService';
import { formatDate } from '../utils/formatters';
import { JobApplication } from '../types/JobApplication';
import { Job } from '../types/Job';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import '../styles/MyApplications.css';

interface ApplicationWithJob extends JobApplication {
  job?: Job;
}

const MyApplications: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) {
        setError('You must be logged in to view your applications');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getUserApplications();
        
        // Fetch job details for each application
        const applicationsWithJobs = await Promise.all(
          data.map(async (application: JobApplication) => {
            try {
              if (application.jobId) {
                const jobData = await getJobById(application.jobId);
                return { ...application, job: jobData };
              }
              return application;
            } catch (err) {
              console.error(`Error fetching job ${application.jobId}:`, err);
              return application;
            }
          })
        );
        
        setApplications(applicationsWithJobs);
        setError(null);
      } catch (err) {
        setError('Failed to load your applications');
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const getStatusClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'reviewed':
        return 'status-reviewed';
      case 'rejected':
        return 'status-rejected';
      case 'accepted':
        return 'status-accepted';
      default:
        return 'status-pending';
    }
  };

  const handleViewJob = (jobId: number | undefined) => {
    if (!jobId) {
      console.error('Job ID is undefined');
      return;
    }
    
    // Use the navigate function to go to the job detail page
    navigate(`/jobs/${jobId}`);
  };

  if (loading) {
    return <LoadingSpinner message="Loading your applications..." />;
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">My Applications</h1>
          <p className="page-subtitle">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Applications</h1>
        <p className="page-subtitle">Track the status of your job applications</p>
      </div>

      {applications.length === 0 ? (
        <div className="no-applications">
          <p>You haven't applied to any jobs yet.</p>
          <button 
            className="accent-button"
            onClick={() => navigate('/jobs')}
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((application) => (
            <div className="application-card" key={application.id}>
              <div className="application-header">
                <h3>{application.job?.title || application.jobTitle}</h3>
                <span className={`application-status ${getStatusClass(application.status)}`}>
                  {application.status}
                </span>
              </div>
              <div className="application-company">{application.job?.company || application.companyName}</div>
              {application.job?.location && (
                <div className="application-location">{application.job.location}</div>
              )}
              <div className="application-date">
                Applied {formatDate(application.appliedAt)}
              </div>
              <button 
                className="view-job-button"
                onClick={() => handleViewJob(application.jobId)}
              >
                View Job
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications; 