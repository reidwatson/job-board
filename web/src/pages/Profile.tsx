import { FC } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Profile.css';

const Profile: FC = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner message="Loading profile..." />;
  }
  
  if (!user) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Please log in to view your profile</p>
        </div>
      </div>
    );
  }
  
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your personal information and preferences</p>
      </div>
      
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <svg 
              className="avatar-placeholder" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M20 21C20 18.7909 18.7909 16.7909 17 15.5C15.2091 14.2091 13.2091 13.5 12 13.5C10.7909 13.5 8.79086 14.2091 7 15.5C5.20914 16.7909 4 18.7909 4 21" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="profile-info">
            <h2>{fullName}</h2>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>
        
        <div className="profile-section">
          <h3 className="section-title">Personal Information</h3>
          <div className="profile-details">
            <div className="profile-detail-item">
              <span className="detail-label">Full Name</span>
              <span className="detail-value">{fullName}</span>
            </div>
            <div className="profile-detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value">{user.email}</span>
            </div>
          </div>
        </div>
        
        <div className="profile-section">
          <h3 className="section-title">Resume (not implemented yet)</h3>
          <div className="resume-container">
            <div className="resume-placeholder">
              <svg className="document-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>No resume uploaded yet</p>
              <button className="upload-resume-button">Upload Resume</button>
            </div>
          </div>
        </div>
        
        <div className="profile-section">
          <h3 className="section-title">Skills (not implemented yet)</h3>
          <div className="skills-container">
            <div className="skill-tag">JavaScript</div>
            <div className="skill-tag">React</div>
            <div className="skill-tag">TypeScript</div>
            <div className="skill-tag">Node.js</div>
            <div className="skill-tag">HTML/CSS</div>
            <div className="skill-tag">UI/UX Design</div>
            <button className="add-skill-button">+ Add Skill</button>
          </div>
        </div>
        
        <div className="profile-section">
          <h3 className="section-title">Preferences (not implemented yet)</h3>
          <div className="preferences-container">
            <div className="preference-item">
              <label className="preference-label">
                <input type="checkbox" defaultChecked />
                <span>Email notifications for new job matches</span>
              </label>
            </div>
            <div className="preference-item">
              <label className="preference-label">
                <input type="checkbox" defaultChecked />
                <span>Application status updates</span>
              </label>
            </div>
            <div className="preference-item">
              <label className="preference-label">
                <input type="checkbox" />
                <span>Newsletter and job market insights</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 