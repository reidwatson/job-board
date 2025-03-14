import { FC, useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const Navbar: FC<NavbarProps> = ({ activePage, onNavigate }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    navigate('/jobs');
  };

  const handleNavigate = (path: string) => {
    // Use both the App's navigation and React Router
    onNavigate(path);
    
    // Map internal paths to actual routes
    switch (path) {
      case 'applications':
        navigate('/applications');
        break;
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
      case 'post':
        navigate('/post');
        break;
      case 'login':
        navigate('/auth', { state: { from: location.pathname } });
        break;
      default:
        // For other pages, stay within the App component
        break;
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => handleNavigate('browse')}>
          <span className="logo-text">Reid's Job Board</span>
        </div>
        
        <div className="navbar-links">
          <button 
            className={`nav-link ${activePage === 'browse' ? 'active' : ''}`}
            onClick={() => handleNavigate('browse')}
          >
            Browse Jobs
          </button>
          <button 
            className={`nav-link ${activePage === 'local' ? 'active' : ''}`}
            onClick={() => handleNavigate('local')}
          >
            Local Jobs
          </button>
          <button 
            className={`nav-link ${activePage === 'search' ? 'active' : ''}`}
            onClick={() => handleNavigate('search')}
          >
            Search Jobs
          </button>
          <button 
            className={`nav-link nav-link-accent ${activePage === 'post' ? 'active' : ''}`}
            onClick={() => handleNavigate('post')}
          >
            Post a Job
          </button>
        </div>
        
        {user ? (
          <div className="navbar-profile" ref={profileMenuRef}>
            <button 
              className={`profile-button ${profileMenuOpen ? 'active' : ''}`}
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              <svg 
                className="profile-icon" 
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
              <span>{user.firstName || 'Profile'}</span>
            </button>
            
            {profileMenuOpen && (
              <div className="profile-dropdown">
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    handleNavigate('profile');
                    setProfileMenuOpen(false);
                  }}
                >
                  <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 21C20 18.7909 18.7909 16.7909 17 15.5C15.2091 14.2091 13.2091 13.5 12 13.5C10.7909 13.5 8.79086 14.2091 7 15.5C5.20914 16.7909 4 18.7909 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  My Profile
                </button>
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    handleNavigate('applications');
                    setProfileMenuOpen(false);
                  }}
                >
                  <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M9 16H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  My Applications
                </button>
                <div className="dropdown-divider"></div>
                <button 
                  className="dropdown-item"
                  onClick={handleLogout}
                >
                  <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="navbar-auth">
            <button 
              className="auth-button login-button"
              onClick={() => handleNavigate('login')}
            >
              Sign In
            </button>
            <button 
              className="auth-button signup-button"
              onClick={() => {
                navigate('/auth', { 
                  state: { 
                    from: location.pathname,
                    signup: true 
                  } 
                });
              }}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 