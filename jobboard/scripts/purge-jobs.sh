#!/bin/bash

# Script to purge all jobs from the job board database

echo "🧹 Job Board Data Purge Tool 🧹"
echo "==============================="
echo "This script will delete ALL jobs from the database."
echo "Make sure your Spring Boot API is running at http://localhost:8080"
echo ""

# Prompt for confirmation
read -p "Are you sure you want to delete all jobs? (y/n): " confirm

if [[ $confirm != "y" && $confirm != "Y" ]]; then
  echo "Operation cancelled."
  exit 0
fi

echo ""
echo "Fetching current jobs..."

# Get current jobs to show count
JOBS=$(curl -s -X GET http://localhost:8080/api/jobs)
JOB_COUNT=$(echo $JOBS | grep -o "\"id\":" | wc -l)

echo "Found $JOB_COUNT jobs in the database."
echo ""

if [ $JOB_COUNT -eq 0 ]; then
  echo "No jobs to delete. Database is already empty."
  exit 0
fi

echo "Deleting all jobs..."
echo ""

# Get all job IDs
JOB_IDS=$(echo $JOBS | grep -o "\"id\":[0-9]*" | grep -o "[0-9]*")

# Delete each job
for id in $JOB_IDS; do
  echo "Deleting job ID: $id"
  DELETE_RESULT=$(curl -s -X DELETE http://localhost:8080/api/jobs/$id)
  if [ $? -eq 0 ]; then
    echo "✅ Job $id deleted successfully"
  else
    echo "❌ Failed to delete job $id"
  fi
done

echo ""
echo "Verifying deletion..."

# Verify all jobs are deleted
REMAINING_JOBS=$(curl -s -X GET http://localhost:8080/api/jobs)
REMAINING_COUNT=$(echo $REMAINING_JOBS | grep -o "\"id\":" | wc -l)

if [ $REMAINING_COUNT -eq 0 ]; then
  echo "✅ All jobs have been successfully deleted!"
else
  echo "⚠️ $REMAINING_COUNT jobs still remain in the database."
fi

echo ""
echo "Operation completed." 