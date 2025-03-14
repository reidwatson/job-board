import { FC, useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../services/jobService';
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

const JobPostForm: FC = () => {
  const navigate = useNavigate();
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
      const response = await createJob(jobData);
      
      if (!response || !response.success) {
        throw new Error(response?.message || 'Failed to create job');
      }
      
      console.log('Job posted successfully:', response);
      
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
      
      // Navigate to jobs page after a delay
      setTimeout(() => {
        navigate('/jobs');
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAutoFill = () => {
    const jobTitles = [
      'Dental Hygienist',
      'Dental Assistant',
      'Dentist',
      'Orthodontist',
      'Dental Office Manager',
      'Pediatric Dentist'
    ];
    
    const companies = [
      'Bright Smile Dental',
      'Family Dental Care',
      'Sunshine Orthodontics',
      'Perfect Teeth Clinic',
      'Gentle Dental Associates',
      'Happy Kids Dental'
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
      'We are looking for an experienced dental professional to join our team. You will be responsible for providing high-quality dental care to our patients in a comfortable and welcoming environment.',
      'Join our dental practice to work with state-of-the-art equipment and a supportive team. You will help patients maintain their oral health and create beautiful smiles.',
      'We need a talented dental professional to help us deliver exceptional patient care. You will be involved in all aspects of dental treatment, from preventive care to complex procedures.'
    ];
    
    const requirements = [
      'Dental degree or certification required. 2+ years of experience in a dental practice. Strong patient care skills and attention to detail.',
      'Experience with modern dental techniques and technologies. Excellent communication skills. Ability to work in a fast-paced environment.',
      'Proven track record of providing high-quality dental care. Knowledge of best practices in dental hygiene. Team player with a positive attitude.'
    ];
    
    const randomIndex = (arr: any[]) => Math.floor(Math.random() * arr.length);
    
    setFormData({
      title: jobTitles[randomIndex(jobTitles)],
      company: companies[randomIndex(companies)],
      location: locations[randomIndex(locations)],
      description: descriptions[randomIndex(descriptions)],
      requirements: requirements[randomIndex(requirements)],
      salary: (60000 + Math.floor(Math.random() * 80000)).toString(),
      contactEmail: 'careers@dentalclinic.com'
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
              placeholder="e.g. careers@example.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Job Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Describe the job responsibilities and expectations..."
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="requirements">Requirements</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={4}
              placeholder="List qualifications, skills, and experience required..."
            ></textarea>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPostForm; 