import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserApplications } from '../services/applicationService';
import { formatDate } from '../utils/formatters';
import { JobApplication } from '../types/JobApplication';
import '../styles/MyApplications.css';

const MyApplications: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await getUserApplications();
        setApplications(data);
        setError(null);
      } catch (err) {
        setError('Failed to load your applications');
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

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

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">My Applications</h1>
          <p className="page-subtitle">Loading your applications...</p>
        </div>
      </div>
    );
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
                <h3>{application.jobTitle}</h3>
                <span className={`application-status ${getStatusClass(application.status)}`}>
                  {application.status}
                </span>
              </div>
              <div className="application-company">{application.companyName}</div>
              <div className="application-date">
                Applied {formatDate(application.appliedAt)}
              </div>
              <button 
                className="view-job-button"
                onClick={() => navigate(`/jobs/${application.jobId}`)}
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