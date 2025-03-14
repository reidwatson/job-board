import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Job } from '../types/Job';
import { getJobs } from '../services/jobService';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/SearchJobs.css';

const SearchJobs: FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    minSalary: '',
    location: '',
    company: ''
  });
  
  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await getJobs();
        console.log('Jobs response:', response);
        
        if (response && response.jobs) {
          setJobs(response.jobs);
        } else {
          console.error('Invalid response format:', response);
          setError('Failed to load jobs');
          setJobs([]);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);
  
  // Update filtered jobs when search term or filters change
  useEffect(() => {
    if (!searchPerformed) return;
    
    const filtered = jobs.filter(job => {
      // Check if job matches search term
      const matchesSearchTerm = searchTerm === '' || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.requirements && job.requirements.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Check if job matches salary filter
      const matchesSalary = filters.minSalary === '' || 
        (job.salary && job.salary >= parseInt(filters.minSalary)) ||
        (job.minSalary && job.minSalary >= parseInt(filters.minSalary));
      
      // Check if job matches location filter
      const matchesLocation = filters.location === '' || 
        job.location.toLowerCase().includes(filters.location.toLowerCase());
      
      // Check if job matches company filter
      const matchesCompany = filters.company === '' || 
        job.company.toLowerCase().includes(filters.company.toLowerCase());
      
      return matchesSearchTerm && matchesSalary && matchesLocation && matchesCompany;
    });
    
    setFilteredJobs(filtered);
  }, [searchTerm, filters, jobs, searchPerformed]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchPerformed(true);
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      minSalary: '',
      location: '',
      company: ''
    });
  };

  const handleJobClick = (job: Job) => {
    navigate(`/jobs/${job.id}`);
  };
  
  if (loading) {
    return <LoadingSpinner message="Loading jobs..." />;
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Search Jobs</h1>
          <p className="page-subtitle">Error: {error}</p>
        </div>
      </div>
    );
  }
  
  // Get unique locations and companies for filter dropdowns
  const uniqueLocations = Array.from(new Set(jobs.map(job => job.location)));
  const uniqueCompanies = Array.from(new Set(jobs.map(job => job.company)));
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Search Jobs</h1>
        <p className="page-subtitle">Find the perfect job opportunity for you</p>
      </div>
      
      <div className="search-jobs-container">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search for job titles, skills, companies, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Search
            </button>
          </div>
          
          <div className="filters-container">
            <div className="filter-group">
              <label htmlFor="minSalary">Min Salary ($)</label>
              <input
                type="number"
                id="minSalary"
                name="minSalary"
                value={filters.minSalary}
                onChange={handleFilterChange}
                placeholder="e.g. 50000"
                className="filter-input"
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="location">Location</label>
              <select
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map((location, index) => (
                  <option key={index} value={location}>{location}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="company">Company</label>
              <select
                id="company"
                name="company"
                value={filters.company}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Companies</option>
                {uniqueCompanies.map((company, index) => (
                  <option key={index} value={company}>{company}</option>
                ))}
              </select>
            </div>
            
            <button 
              type="button" 
              className="clear-filters-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </form>
        
        <div className="search-results">
          {searchPerformed ? (
            <>
              <div className="results-header">
                <h3>Search Results</h3>
                <span className="results-count">{filteredJobs.length} jobs found</span>
              </div>
              
              {filteredJobs.length === 0 ? (
                <div className="no-results">
                  <p>No jobs match your search criteria.</p>
                  <button 
                    className="clear-search-button"
                    onClick={clearFilters}
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <div className="jobs-grid">
                  {filteredJobs.map(job => (
                    <div 
                      key={job.id} 
                      className="job-card" 
                      onClick={() => handleJobClick(job)}
                    >
                      <h3>{job.title}</h3>
                      <div className="job-company">{job.company}</div>
                      <div className="job-location">{job.location}</div>
                      <div className="job-salary">
                        ${job.minSalary && job.maxSalary 
                          ? `${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}`
                          : job.salary?.toLocaleString() || 'Not specified'}
                      </div>
                      <div className="job-posted">
                        Posted: {new Date(job.createdAt || job.postedDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="search-prompt">
              <p>Enter search terms and apply filters to find your perfect job.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchJobs; 