import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import JobList from './pages/JobList';
import JobPostForm from './pages/JobPostForm';
import JobDetail from './pages/JobDetail';
import LocalJobs from './pages/LocalJobs';
import SearchJobs from './pages/SearchJobs';
import Profile from './pages/Profile';
import MyApplications from './pages/MyApplications';
import Navbar from './components/Navbar';
import SideMenu from './components/SideMenu';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import './styles/global.css';
import './styles/App.css';

function App() {
  const [activePage, setActivePage] = useState<string>('browse');
  const location = useLocation();
  const { user } = useAuth();

  // Set active page based on current route
  useEffect(() => {
    const path = location.pathname;
    
    if (path.includes('/jobs') && !path.includes('/jobs/')) {
      setActivePage('browse');
    } else if (path.includes('/local')) {
      setActivePage('local');
    } else if (path.includes('/search')) {
      setActivePage('search');
    } else if (path.includes('/profile')) {
      setActivePage('profile');
    } else if (path.includes('/applications')) {
      setActivePage('applications');
    } else if (path.includes('/post')) {
      setActivePage('post');
    } else if (path.includes('/jobs/')) {
      setActivePage('detail');
    }
  }, [location]);

  const handleNavigate = (page: string) => {
    setActivePage(page);
  };

  return (
    <div className="app-container">
      <Navbar activePage={activePage} onNavigate={handleNavigate} />
      
      <div className="content-container">
        <SideMenu activePage={activePage} onNavigate={handleNavigate} />
        
        <main className="main-content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/jobs" replace />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/local" element={<LocalJobs />} />
            <Route path="/search" element={<SearchJobs />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/applications" element={<MyApplications />} />
              <Route path="/post" element={<JobPostForm />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/jobs" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App; 