import { FC, useState, FormEvent, ChangeEvent } from 'react';
import '../styles/JobPostForm.css';

interface JobFormData {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salary: string;
  contactEmail: string;
}

interface JobPostFormProps {
  onJobPosted: () => void;
}

const JobPostForm: FC<JobPostFormProps> = ({ onJobPosted }) => {
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    salary: '',
    contactEmail: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Validate form data
      if (!formData.title || !formData.company || !formData.location || 
          !formData.description || !formData.salary) {
        throw new Error('Please fill in all required fields');
      }
      
      // Convert salary to number
      const salaryNumber = parseFloat(formData.salary);
      if (isNaN(salaryNumber)) {
        throw new Error('Salary must be a valid number');
      }
      
      // Prepare data for API
      const jobData = {
        ...formData,
        salary: salaryNumber
      };
      
      // Submit to API
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jobData)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Job posted successfully:', data);
      
      // Reset form and show success message
      setFormData({
        title: '',
        company: '',
        location: '',
        description: '',
        requirements: '',
        salary: '',
        contactEmail: ''
      });
      
      setSuccess(true);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAutoFill = () => {
    const jobTitles = [
      'Senior Software Engineer',
      'Frontend Developer',
      'UX Designer',
      'Product Manager',
      'Data Scientist',
      'DevOps Engineer'
    ];
    
    const companies = [
      'Tech Innovations Inc.',
      'Digital Solutions Group',
      'Future Systems',
      'Cloud Dynamics',
      'Data Insights Corp',
      'Creative Tech Labs'
    ];
    
    const locations = [
      'San Francisco, CA',
      'New York, NY',
      'Remote',
      'Austin, TX',
      'Seattle, WA',
      'Chicago, IL'
    ];
    
    const descriptions = [
      'We are looking for an experienced professional to join our team and help build cutting-edge applications. You will be responsible for designing, developing, and maintaining high-quality software solutions.',
      'Join our team to work on exciting projects that impact millions of users. You will collaborate with cross-functional teams to deliver innovative solutions that drive business growth.',
      'We need a talented individual to help us create exceptional user experiences. You will be involved in all aspects of the development lifecycle, from concept to deployment.'
    ];
    
    const requirements = [
      'Bachelor\'s degree in Computer Science or related field. 5+ years of experience in software development. Strong problem-solving skills and attention to detail.',
      'Experience with modern frameworks and technologies. Excellent communication skills. Ability to work in a fast-paced environment.',
      'Proven track record of delivering high-quality projects. Knowledge of best practices and design patterns. Team player with a positive attitude.'
    ];
    
    const randomIndex = (arr: any[]) => Math.floor(Math.random() * arr.length);
    
    setFormData({
      title: jobTitles[randomIndex(jobTitles)],
      company: companies[randomIndex(companies)],
      location: locations[randomIndex(locations)],
      description: descriptions[randomIndex(descriptions)],
      requirements: requirements[randomIndex(requirements)],
      salary: (80000 + Math.floor(Math.random() * 120000)).toString(),
      contactEmail: 'careers@example.com'
    });
  };
  
  const dismissBadge = () => {
    setSuccess(false);
    setError(null);
  };
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Post a New Job</h1>
        <p className="page-subtitle">Fill out the form below to post a new job listing</p>
      </div>
      
      <div className="job-post-form-container">
        <div className="form-header">
          <button 
            type="button" 
            className="auto-fill-button accent-button"
            onClick={handleAutoFill}
          >
            Auto-Fill Form
          </button>
        </div>
        
        {error && (
          <div className="badge badge-error">
            {error}
            <button className="badge-close" onClick={dismissBadge}>×</button>
          </div>
        )}
        
        {success && (
          <div className="badge badge-success">
            Job posted successfully! It will now appear in the job listings.
            <button className="badge-close" onClick={dismissBadge}>×</button>
          </div>
        )}
        
        <form className="job-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Job Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior Software Engineer"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="company">Company *</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Tech Innovations Inc."
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. San Francisco, CA or Remote"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="salary">Salary (USD) *</label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. 120000"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="contactEmail">Contact Email</label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="e.g. jobs@company.com"
            />
          </div>
          
          <div className="form-group full-width">
            <label htmlFor="description">Job Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the job role, responsibilities, and what the candidate will be doing..."
              rows={5}
              required
            />
          </div>
          
          <div className="form-group full-width">
            <label htmlFor="requirements">Requirements</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="List the skills, qualifications, and experience required for this position..."
              rows={5}
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button accent-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Posting...
                </>
              ) : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPostForm; 