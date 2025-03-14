#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Base URL for the API
BASE_URL="http://localhost:8080/api/jobs"

# Test data
TEST_JOB='{
  "title": "Test Engineer",
  "company": "Test Corp",
  "location": "Test City, TS",
  "description": "This is a test job posting",
  "salary": 100000,
  "contactEmail": "test@testcorp.com",
  "requirements": "Testing skills"
}'

# Function to check if the API is available
check_api() {
  echo -e "${BLUE}Checking if API is available...${NC}"
  if curl -s -o /dev/null -w "%{http_code}" $BASE_URL | grep -q "200"; then
    echo -e "${GREEN}API is available.${NC}"
    return 0
  else
    echo -e "${RED}API is not available. Make sure the application is running.${NC}"
    return 1
  fi
}

# Function to test GET all jobs
test_get_all() {
  echo -e "${BLUE}Testing GET all jobs...${NC}"
  response=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL)
  
  if [ "$response" == "200" ]; then
    echo -e "${GREEN}GET all jobs: SUCCESS (Status: $response)${NC}"
    return 0
  else
    echo -e "${RED}GET all jobs: FAILED (Status: $response)${NC}"
    return 1
  fi
}

# Function to test POST a new job
test_post_job() {
  echo -e "${BLUE}Testing POST a new job...${NC}"
  response=$(curl -s -X POST -H "Content-Type: application/json" -d "$TEST_JOB" -o /tmp/job_response.json -w "%{http_code}" $BASE_URL)
  
  if [ "$response" == "201" ]; then
    echo -e "${GREEN}POST job: SUCCESS (Status: $response)${NC}"
    # Extract the job ID from the response
    JOB_ID=$(cat /tmp/job_response.json | grep -o '"id":[0-9]*' | cut -d':' -f2)
    echo -e "${GREEN}Created job with ID: $JOB_ID${NC}"
    return 0
  else
    echo -e "${RED}POST job: FAILED (Status: $response)${NC}"
    echo -e "${RED}Response: $(cat /tmp/job_response.json)${NC}"
    return 1
  fi
}

# Function to test GET a specific job
test_get_job() {
  if [ -z "$JOB_ID" ]; then
    echo -e "${YELLOW}Skipping GET job test: No job ID available${NC}"
    return 0
  fi
  
  echo -e "${BLUE}Testing GET job with ID $JOB_ID...${NC}"
  response=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/$JOB_ID)
  
  if [ "$response" == "200" ]; then
    echo -e "${GREEN}GET job: SUCCESS (Status: $response)${NC}"
    return 0
  else
    echo -e "${RED}GET job: FAILED (Status: $response)${NC}"
    return 1
  fi
}

# Function to test PUT (update) a job
test_put_job() {
  if [ -z "$JOB_ID" ]; then
    echo -e "${YELLOW}Skipping PUT job test: No job ID available${NC}"
    return 0
  fi
  
  # Updated job data
  UPDATED_JOB='{
    "title": "Updated Test Engineer",
    "company": "Test Corp",
    "location": "Test City, TS",
    "description": "This is an updated test job posting",
    "salary": 110000,
    "contactEmail": "test@testcorp.com",
    "requirements": "Advanced testing skills"
  }'
  
  echo -e "${BLUE}Testing PUT job with ID $JOB_ID...${NC}"
  response=$(curl -s -X PUT -H "Content-Type: application/json" -d "$UPDATED_JOB" -o /dev/null -w "%{http_code}" $BASE_URL/$JOB_ID)
  
  if [ "$response" == "200" ]; then
    echo -e "${GREEN}PUT job: SUCCESS (Status: $response)${NC}"
    return 0
  else
    echo -e "${RED}PUT job: FAILED (Status: $response)${NC}"
    return 1
  fi
}

# Function to test DELETE a job
test_delete_job() {
  if [ -z "$JOB_ID" ]; then
    echo -e "${YELLOW}Skipping DELETE job test: No job ID available${NC}"
    return 0
  fi
  
  echo -e "${BLUE}Testing DELETE job with ID $JOB_ID...${NC}"
  response=$(curl -s -X DELETE -o /dev/null -w "%{http_code}" $BASE_URL/$JOB_ID)
  
  if [ "$response" == "204" ]; then
    echo -e "${GREEN}DELETE job: SUCCESS (Status: $response)${NC}"
    return 0
  else
    echo -e "${RED}DELETE job: FAILED (Status: $response)${NC}"
    return 1
  fi
}

# Main test function
run_tests() {
  echo -e "${BLUE}=== Running API Tests ===${NC}"
  echo ""
  
  # Check if API is available
  check_api
  if [ $? -ne 0 ]; then
    return 1
  fi
  
  # Run tests
  test_get_all
  GET_ALL_RESULT=$?
  
  test_post_job
  POST_RESULT=$?
  
  test_get_job
  GET_RESULT=$?
  
  test_put_job
  PUT_RESULT=$?
  
  test_delete_job
  DELETE_RESULT=$?
  
  # Print test summary
  echo ""
  echo -e "${BLUE}=== Test Summary ===${NC}"
  
  if [ $GET_ALL_RESULT -eq 0 ]; then
    echo -e "${GREEN}✓ GET all jobs${NC}"
  else
    echo -e "${RED}✗ GET all jobs${NC}"
  fi
  
  if [ $POST_RESULT -eq 0 ]; then
    echo -e "${GREEN}✓ POST job${NC}"
  else
    echo -e "${RED}✗ POST job${NC}"
  fi
  
  if [ $GET_RESULT -eq 0 ]; then
    echo -e "${GREEN}✓ GET job${NC}"
  else
    echo -e "${RED}✗ GET job${NC}"
  fi
  
  if [ $PUT_RESULT -eq 0 ]; then
    echo -e "${GREEN}✓ PUT job${NC}"
  else
    echo -e "${RED}✗ PUT job${NC}"
  fi
  
  if [ $DELETE_RESULT -eq 0 ]; then
    echo -e "${GREEN}✓ DELETE job${NC}"
  else
    echo -e "${RED}✗ DELETE job${NC}"
  fi
  
  # Check if all tests passed
  if [ $GET_ALL_RESULT -eq 0 ] && [ $POST_RESULT -eq 0 ] && [ $GET_RESULT -eq 0 ] && [ $PUT_RESULT -eq 0 ] && [ $DELETE_RESULT -eq 0 ]; then
    echo ""
    echo -e "${GREEN}All API tests passed!${NC}"
    return 0
  else
    echo ""
    echo -e "${RED}Some API tests failed.${NC}"
    return 1
  fi
}

# Run the tests
run_tests
exit $? 