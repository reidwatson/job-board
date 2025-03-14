import { FC, useState, useEffect } from 'react';
import { Job } from '../types/Job';
import '../styles/LocalJobs.css';
// Import React Leaflet components directly
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';
// Import Leaflet for icon fixes
import L from 'leaflet';

// Fix Leaflet default icon issues
// This needs to be done before rendering any markers
const fixLeafletIcon = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
};
fixLeafletIcon();

interface LocalJobsProps {
  jobs: Job[];
  onJobClick: (job: Job) => void;
}

interface JobWithCoordinates extends Job {
  lat?: number;
  lng?: number;
}

const LocalJobs: FC<LocalJobsProps> = ({ jobs, onJobClick }) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [jobsWithCoordinates, setJobsWithCoordinates] = useState<JobWithCoordinates[]>([]);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setLoading(false);
        },
        (err) => {
          console.error('Error getting location:', err);
          setError('Unable to get your location. Please enable location services.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  }, []);

  // Simulate geocoding job locations to get coordinates
  useEffect(() => {
    if (!userLocation) return;

    // This is a simulation - in a real app, you would geocode the addresses
    const simulateGeocode = (job: Job): JobWithCoordinates => {
      // Generate random coordinates near the user's location
      const lat = userLocation[0] + (Math.random() - 0.5) * 0.1;
      const lng = userLocation[1] + (Math.random() - 0.5) * 0.1;
      
      return {
        ...job,
        lat,
        lng
      };
    };

    // Only process jobs that have a non-remote location
    const localJobs = jobs
      .filter(job => !job.location.toLowerCase().includes('remote'))
      .map(simulateGeocode);

    setJobsWithCoordinates(localJobs);
  }, [jobs, userLocation]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Local Jobs</h1>
          <p className="page-subtitle">Discover job opportunities near your location</p>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Getting your location...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Local Jobs</h1>
          <p className="page-subtitle">Discover job opportunities near your location</p>
        </div>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Local Jobs</h1>
          <p className="page-subtitle">Discover job opportunities near your location</p>
        </div>
        <div className="error">Unable to determine your location.</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Local Jobs</h1>
        <p className="page-subtitle">Discover job opportunities near your location</p>
      </div>
      
      <div className="local-jobs-container">
        <div className="map-container">
          <MapContainer 
            center={userLocation} 
            zoom={12} 
            style={{ height: '500px', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* User location marker */}
            <Marker position={userLocation}>
              <Popup>
                <div className="user-location-popup">
                  <h3>Your Location</h3>
                </div>
              </Popup>
            </Marker>
            
            {/* Job markers */}
            {jobsWithCoordinates.map(job => (
              job.lat && job.lng ? (
                <Marker 
                  key={job.id} 
                  position={[job.lat, job.lng]}
                  eventHandlers={{
                    click: () => {
                      onJobClick(job);
                    },
                    mouseover: (e: any) => {
                      e.target.openPopup();
                    }
                  }}
                >
                  <Popup>
                    <div className="job-popup">
                      <h3>{job.title}</h3>
                      <p className="job-company">{job.company}</p>
                      <p className="job-location">{job.location}</p>
                      <p className="job-distance">
                        {calculateDistance(userLocation[0], userLocation[1], job.lat, job.lng).toFixed(1)} miles away
                      </p>
                      <p className="job-salary">${job.salary.toLocaleString()}</p>
                      <button 
                        className="view-job-button"
                        onClick={() => onJobClick(job)}
                      >
                        View Details
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ) : null
            ))}
          </MapContainer>
        </div>
        
        <div className="local-jobs-list">
          <h2 className="section-title">Available Jobs</h2>
          {jobsWithCoordinates.length === 0 ? (
            <p className="no-jobs">No local jobs found in your area.</p>
          ) : (
            <div className="local-jobs-grid">
              {jobsWithCoordinates.map(job => (
                <div 
                  key={job.id} 
                  className="job-card" 
                  onClick={() => onJobClick(job)}
                >
                  <div className="job-card-content">
                    <h2 className="job-title">{job.title}</h2>
                    <div className="job-company">{job.company}</div>
                    <div className="job-location">{job.location}</div>
                    <div className="job-distance">
                      {job.lat && job.lng && userLocation ? 
                        `~${calculateDistance(userLocation[0], userLocation[1], job.lat, job.lng).toFixed(1)} miles away` : 
                        'Distance unknown'}
                    </div>
                    <div className="job-salary">${job.salary.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Calculate distance between two coordinates in miles
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default LocalJobs; 