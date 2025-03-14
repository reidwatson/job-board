#!/bin/bash

# Script to generate dental industry job postings

echo "🦷 Dental Industry Job Generator 🦷"
echo "=================================="
echo "This script will generate dental industry job postings."
echo "Make sure your Spring Boot API is running at http://localhost:8080"
echo ""

# Default number of jobs to generate
NUM_JOBS=5

# Check if a command-line argument was provided
if [ $# -gt 0 ]; then
  # Check if the argument is a positive integer
  if [[ $1 =~ ^[0-9]+$ ]]; then
    NUM_JOBS=$1
  else
    echo "Error: Argument must be a positive integer."
    echo "Usage: $0 [number_of_jobs]"
    exit 1
  fi
fi

echo "Generating $NUM_JOBS dental industry job postings..."
echo ""

# Arrays of dental job titles
TITLES=(
  "Dental Hygienist"
  "Dentist"
  "Orthodontist"
  "Dental Assistant"
  "Dental Office Manager"
  "Pediatric Dentist"
  "Oral Surgeon"
  "Dental Receptionist"
  "Dental Lab Technician"
  "Endodontist"
  "Periodontist"
  "Prosthodontist"
  "Dental Sales Representative"
  "Dental Insurance Coordinator"
  "Dental Practice Consultant"
  "Dental Equipment Technician"
  "Dental Researcher"
  "Dental School Instructor"
  "Dental Public Health Specialist"
  "Dental Anesthesiologist"
)

# Arrays of dental companies
COMPANIES=(
  "Bright Smile Dental"
  "Perfect Teeth Clinic"
  "Gentle Dental Care"
  "Family Dental Associates"
  "Advanced Orthodontics"
  "Sunrise Dental Group"
  "Pearly Whites Dentistry"
  "Dental Innovations Inc."
  "Oral Health Partners"
  "Smiles For Life Dental"
  "Precision Dental Lab"
  "Dental Depot"
  "Modern Dental Solutions"
  "Elite Dental Specialists"
  "Comfort Dental Care"
  "Dental Excellence Center"
  "Premier Dental Group"
  "Dental Technologies Corp."
  "Healthy Smiles Dental"
  "Dental Wellness Clinic"
)

# Arrays of locations
LOCATIONS=(
  "San Francisco, CA"
  "New York, NY"
  "Chicago, IL"
  "Boston, MA"
  "Seattle, WA"
  "Austin, TX"
  "Denver, CO"
  "Miami, FL"
  "Atlanta, GA"
  "Portland, OR"
  "Los Angeles, CA"
  "Dallas, TX"
  "Phoenix, AZ"
  "Philadelphia, PA"
  "Remote"
)

# Arrays of descriptions
DESCRIPTIONS=(
  "Join our team of dental professionals dedicated to providing exceptional patient care in a modern, state-of-the-art facility."
  "We are seeking a skilled dental professional to help us deliver high-quality dental services to our growing patient base."
  "Be part of a leading dental practice that focuses on comprehensive care and the latest dental technologies."
  "Our dental clinic is looking for a talented individual to join our team and contribute to our mission of improving oral health."
  "Work with a collaborative team of dental experts in a patient-centered environment focused on excellence."
  "Help us expand our dental services and bring smiles to more patients in our community."
  "Join a dental practice that values innovation, continuous learning, and exceptional patient experiences."
  "We're looking for a dental professional who is passionate about providing the highest standard of care to patients of all ages."
  "Become part of a dental team that is committed to preventive care and education for optimal oral health."
  "Our growing dental practice needs skilled professionals who can deliver compassionate and comprehensive dental care."
)

# Arrays of requirements
REQUIREMENTS=(
  "DDS or DMD degree from an accredited dental school. Current dental license. Excellent clinical and interpersonal skills."
  "Dental hygiene degree and current state license. Minimum 2 years of clinical experience preferred."
  "Dental assistant certification and X-ray certification. Experience with dental software and digital radiography."
  "Bachelor's degree in a related field. Strong organizational and communication skills. Experience in a dental office setting."
  "Orthodontic specialty training and certification. Experience with various orthodontic techniques and technologies."
  "Oral surgery residency completion. Experience with dental implants and complex extractions."
  "Dental laboratory experience. Knowledge of CAD/CAM technology and digital impressions."
  "Pediatric dentistry specialty. Experience working with children and patients with special needs."
  "Endodontic specialty training. Experience with microscope-assisted endodontics and regenerative procedures."
  "Dental office management experience. Knowledge of dental insurance and billing procedures."
)

# Generate and post jobs
for ((i=1; i<=$NUM_JOBS; i++)); do
  echo "Generating job $i of $NUM_JOBS..."
  
  # Randomly select elements from arrays
  TITLE_INDEX=$((RANDOM % ${#TITLES[@]}))
  COMPANY_INDEX=$((RANDOM % ${#COMPANIES[@]}))
  LOCATION_INDEX=$((RANDOM % ${#LOCATIONS[@]}))
  DESCRIPTION_INDEX=$((RANDOM % ${#DESCRIPTIONS[@]}))
  REQUIREMENTS_INDEX=$((RANDOM % ${#REQUIREMENTS[@]}))
  
  # Generate random salary between 50000 and 200000
  SALARY=$((50000 + RANDOM % 150001))
  
  # Generate random email
  EMAIL="careers@${COMPANIES[$COMPANY_INDEX]// /}.com"
  EMAIL=$(echo $EMAIL | tr '[:upper:]' '[:lower:]')
  
  # Create JSON payload
  JSON_DATA=$(cat <<EOF
{
  "title": "${TITLES[$TITLE_INDEX]}",
  "company": "${COMPANIES[$COMPANY_INDEX]}",
  "location": "${LOCATIONS[$LOCATION_INDEX]}",
  "description": "${DESCRIPTIONS[$DESCRIPTION_INDEX]}",
  "requirements": "${REQUIREMENTS[$REQUIREMENTS_INDEX]}",
  "salary": $SALARY,
  "contactEmail": "$EMAIL"
}
EOF
)
  
  # Post job to API
  echo "Posting job: ${TITLES[$TITLE_INDEX]} at ${COMPANIES[$COMPANY_INDEX]}"
  RESPONSE=$(curl -s -X POST http://localhost:8080/api/jobs \
    -H "Content-Type: application/json" \
    -d "$JSON_DATA")
  
  # Check if job was created successfully
  if [[ $RESPONSE == *"id"* ]]; then
    JOB_ID=$(echo $RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
    echo "✅ Job created successfully with ID: $JOB_ID"
  else
    echo "❌ Failed to create job. API response: $RESPONSE"
  fi
  
  echo ""
done

echo "Job generation completed!"
echo "Generated $NUM_JOBS dental industry job postings."
echo ""
echo "To view all jobs, visit: http://localhost:5173" 