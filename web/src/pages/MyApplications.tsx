import { FC, useState } from 'react';
import '../styles/MyApplications.css';

interface Application {
  id: number;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'accepted';
}

const MyApplications: FC = () => {
  // Sample applications data
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      jobTitle: 'Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      appliedDate: '2023-06-15',
      status: 'interview'
    },
    {
      id: 2,
      jobTitle: 'UX Designer',
      company: 'DesignHub',
      location: 'Remote',
      appliedDate: '2023-06-10',
      status: 'reviewed'
    },
    {
      id: 3,
      jobTitle: 'Full Stack Engineer',
      company: 'WebSolutions',
      location: 'New York, NY',
      appliedDate: '2023-06-05',
      status: 'pending'
    },
    {
      id: 4,
      jobTitle: 'Product Manager',
      company: 'InnovateTech',
      location: 'Austin, TX',
      appliedDate: '2023-05-28',
      status: 'rejected'
    },
    {
      id: 5,
      jobTitle: 'DevOps Engineer',
      company: 'CloudSystems',
      location: 'Seattle, WA',
      appliedDate: '2023-05-20',
      status: 'accepted'
    }
  ]);

  const [filter, setFilter] = useState<string>('all');

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'reviewed': return 'Reviewed';
      case 'interview': return 'Interview';
      case 'rejected': return 'Rejected';
      case 'accepted': return 'Accepted';
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    return `status-badge ${status}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Applications</h1>
        <p className="page-subtitle">Track and manage your job applications</p>
      </div>
      
      <div className="applications-container">
        <div className="applications-filters">
          <button 
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-button ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-button ${filter === 'reviewed' ? 'active' : ''}`}
            onClick={() => setFilter('reviewed')}
          >
            Reviewed
          </button>
          <button 
            className={`filter-button ${filter === 'interview' ? 'active' : ''}`}
            onClick={() => setFilter('interview')}
          >
            Interview
          </button>
          <button 
            className={`filter-button ${filter === 'accepted' ? 'active' : ''}`}
            onClick={() => setFilter('accepted')}
          >
            Accepted
          </button>
          <button 
            className={`filter-button ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </button>
        </div>
        
        <div className="applications-list">
          {filteredApplications.length === 0 ? (
            <div className="no-applications">
              <p>No applications found.</p>
            </div>
          ) : (
            filteredApplications.map(application => (
              <div key={application.id} className="application-card">
                <div className="application-header">
                  <h3 className="job-title">{application.jobTitle}</h3>
                  <span className={getStatusClass(application.status)}>
                    {getStatusLabel(application.status)}
                  </span>
                </div>
                <div className="application-details">
                  <div className="company-info">
                    <p className="company-name">{application.company}</p>
                    <p className="job-location">{application.location}</p>
                  </div>
                  <div className="application-meta">
                    <p className="applied-date">Applied: {formatDate(application.appliedDate)}</p>
                  </div>
                </div>
                <div className="application-actions">
                  <button className="view-application-button">View Details</button>
                  <button className="withdraw-button">Withdraw</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplications; 