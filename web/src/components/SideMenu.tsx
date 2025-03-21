import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SideMenu.css';

interface SideMenuProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const SideMenu: FC<SideMenuProps> = ({ activePage, onNavigate }) => {
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    // Use both the App's navigation and React Router
    onNavigate(page);
    
    // Map internal paths to actual routes
    switch (page) {
      case 'browse':
        navigate('/jobs');
        break;
      case 'local':
        navigate('/local');
        break;
      case 'search':
        navigate('/search');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'applications':
        navigate('/applications');
        break;
      case 'post':
        navigate('/post');
        break;
      default:
        navigate('/jobs');
        break;
    }
  };

  return (
    <div className="side-menu">
      <div className="menu-section">
        <h4 className="menu-section-title">Find Jobs</h4>
        <nav className="side-menu-nav">
          <button 
            className={`menu-item ${activePage === 'browse' ? 'active' : ''}`}
            onClick={() => handleNavigate('browse')}
          >
            <svg className="menu-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Recent Jobs
          </button>
          <button 
            className={`menu-item ${activePage === 'local' ? 'active' : ''}`}
            onClick={() => handleNavigate('local')}
          >
            <svg className="menu-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21C16.4183 21 20 17.4183 20 13C20 8.58172 16.4183 5 12 5C7.58172 5 4 8.58172 4 13C4 17.4183 7.58172 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 13V17" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Local Jobs
          </button>
          <button 
            className={`menu-item ${activePage === 'search' ? 'active' : ''}`}
            onClick={() => handleNavigate('search')}
          >
            <svg className="menu-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Search Jobs
          </button>
        </nav>
      </div>
      
      <div className="menu-section">
        <h4 className="menu-section-title">My Account</h4>
        <nav className="side-menu-nav">
          <button 
            className={`menu-item ${activePage === 'profile' ? 'active' : ''}`}
            onClick={() => handleNavigate('profile')}
          >
            <svg className="menu-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 21C20 18.7909 18.7909 16.7909 17 15.5C15.2091 14.2091 13.2091 13.5 12 13.5C10.7909 13.5 8.79086 14.2091 7 15.5C5.20914 16.7909 4 18.7909 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            My Profile
          </button>
          <button 
            className={`menu-item ${activePage === 'applications' ? 'active' : ''}`}
            onClick={() => handleNavigate('applications')}
          >
            <svg className="menu-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M9 16H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            My Applications
          </button>
        </nav>
      </div>
      
      <div className="menu-section">
        <h4 className="menu-section-title">For Employers</h4>
        <nav className="side-menu-nav">
          <button 
            className={`menu-item ${activePage === 'post' ? 'active' : ''}`}
            onClick={() => handleNavigate('post')}
          >
            <svg className="menu-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Post a Job
          </button>
        </nav>
      </div>
    </div>
  );
};

export default SideMenu; 