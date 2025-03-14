# Reid's Job Board Frontend

This is a React TypeScript frontend for Reid's Job Board application. It connects to the Spring Boot backend API to display job listings with a modern, user-friendly interface.

## Color Scheme

- Primary Teal: #00BBB9
- Accent Orange: #FF6700
- White: #FFFFFF
- Light Gray: #F5F5F5
- Medium Gray: #E0E0E0
- Dark Gray: #333333

## Features

- Modern UI with responsive design and clean aesthetics
- Custom branding with "Reid's Job Board" logo and favicon
- Side menu navigation for improved user experience
- View all job listings in a responsive card-based grid layout
- Click on a job card to view detailed information
- Post new job listings through a user-friendly form
- Search jobs by title, company, or location
- View local jobs on an interactive map based on your location
- User profile and application management
- Responsive design that works on desktop and mobile devices
- TypeScript for type safety and better developer experience
- Consistent styling with standardized spacing, colors, and typography

## Project Structure

```
web/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx (Navigation component with profile dropdown)
│   │   └── SideMenu.tsx (Side navigation menu with categorized sections)
│   ├── pages/
│   │   ├── JobList.tsx (Component to display all jobs)
│   │   ├── JobDetail.tsx (Component to display a single job)
│   │   ├── JobPostForm.tsx (Form to post new jobs)
│   │   ├── LocalJobs.tsx (Map view of jobs near user location)
│   │   ├── SearchJobs.tsx (Search functionality for jobs)
│   │   ├── Profile.tsx (User profile management)
│   │   └── MyApplications.tsx (User job applications management)
│   ├── styles/
│   │   ├── global.css (Global styles and CSS variables)
│   │   ├── App.css (App component styles)
│   │   ├── Navbar.css (Navbar styles with profile dropdown)
│   │   ├── SideMenu.css (Side menu styles with sections)
│   │   ├── JobList.css (Job list styles)
│   │   ├── JobDetail.css (Job detail styles)
│   │   ├── JobPostForm.css (Job posting form styles)
│   │   ├── LocalJobs.css (Local jobs map view styles)
│   │   ├── SearchJobs.css (Search page styles)
│   │   ├── Profile.css (Profile page styles)
│   │   └── MyApplications.css (Applications page styles)
│   ├── types/
│   │   └── Job.ts (TypeScript interface for Job data)
│   ├── App.tsx (Main application component)
│   └── main.tsx (Entry point)
├── public/
│   ├── images/
│   │   └── reids-jobboard-logo.svg (Application logo)
│   └── favicon.svg (Custom favicon)
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Prerequisites

- Node.js (v14 or higher)
- The Spring Boot backend running on http://localhost:8080

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   cd web
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Building for Production

To build the application for production:

```
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## API Connection

The application connects to the Spring Boot backend at `http://localhost:8080/api/jobs`. Make sure the backend is running and properly configured with CORS to allow requests from the frontend.

## User Interface

### Navigation

The application features a modern navigation system with:
- Top navbar with Reid's Job Board logo and profile dropdown
- Side menu with categorized navigation links for all features
- Consistent page headers and styling across all views

### Job Browsing

- View all jobs in a responsive card grid
- Each card displays key job information
- Click on a card to view detailed job information
- Back button to return to the job list

### Local Jobs

- Interactive map showing jobs near your current location
- Requires location permission from your browser
- Hover over markers to see job information
- Click on markers to view job details
- List view of local jobs below the map

### Job Search

- Search for jobs by title, company, or location
- Filter results by salary range and other criteria
- Clear search and filter options
- Results displayed in the same card format as the main job list

### User Profile

- View and edit personal information
- Upload and manage resume
- Add and remove skills
- Manage notification preferences

### My Applications

- Track job applications status
- Filter applications by status (pending, reviewed, interview, etc.)
- View application details
- Withdraw applications

### Job Posting

- User-friendly form to post new job listings
- Form validation to ensure all required fields are filled
- Success and error messages for feedback
- Automatic redirection to job listings after successful posting

## External Libraries

- React Leaflet for interactive maps
- Leaflet for map functionality
- React Router for navigation (planned for future implementation)

## Notes

- This application uses Vite as the build tool
- TypeScript is used for type safety
- The application uses the native fetch API for data fetching
- No authentication is implemented in this version
- CSS variables are used for consistent styling
- Responsive design with mobile-first approach
