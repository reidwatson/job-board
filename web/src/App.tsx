import { useState, useEffect } from 'react';
import JobList from './pages/JobList';
import JobDetail from './pages/JobDetail';
import JobPostForm from './pages/JobPostForm';
import LocalJobs from './pages/LocalJobs';
import SearchJobs from './pages/SearchJobs';
import Profile from './pages/Profile';
import MyApplications from './pages/MyApplications';
import Navbar from './components/Navbar';
import SideMenu from './components/SideMenu';
import { Job } from './types/Job';
import './styles/global.css';
import './styles/App.css';

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<string>('browse');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      console.log('Fetching jobs from API...');
      
      const response = await fetch('/api/jobs');
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      // Sort jobs by posted date (newest first)
      const sortedJobs = [...data].sort((a, b) => 
        new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      );
      
      setJobs(sortedJobs);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
  };

  const handleBackClick = () => {
    setSelectedJob(null);
  };

  const handleNavigate = (page: string) => {
    setActivePage(page);
    setSelectedJob(null);
  };

  const handleJobPosted = () => {
    fetchJobs();
    setActivePage('browse');
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading jobs...</div>;
    }

    if (error) {
      return <div className="error">Error: {error}</div>;
    }

    if (selectedJob) {
      return <JobDetail job={selectedJob} onBackClick={handleBackClick} />;
    }

    switch (activePage) {
      case 'post':
        return <JobPostForm onJobPosted={handleJobPosted} />;
      case 'local':
        return <LocalJobs jobs={jobs} onJobClick={handleJobClick} />;
      case 'search':
        return <SearchJobs jobs={jobs} onJobClick={handleJobClick} />;
      case 'profile':
        return <Profile />;
      case 'applications':
        return <MyApplications />;
      default:
        return <JobList jobs={jobs} onJobClick={handleJobClick} />;
    }
  };

  // Determine if sidebar should be shown - now shown on all pages except job detail
  const showSidebar = !selectedJob;
  
  // Determine main content class based on sidebar visibility
  const mainContentClass = showSidebar ? 'main-content' : 'main-content main-content-full';

  return (
    <div className="app-container">
      <Navbar activePage={activePage} onNavigate={handleNavigate} />
      
      <div className="content-container">
        {showSidebar && <SideMenu activePage={activePage} onNavigate={handleNavigate} />}
        
        <main className={mainContentClass}>
          {renderContent()}
        </main>
      </div>
      
    </div>
  );
}

export default App; 