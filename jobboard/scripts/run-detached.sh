#!/bin/bash

# Simple script to run the application in detached mode
LOG_FILE="/var/log/jobboard/app.log"

# Create log directory if it doesn't exist
mkdir -p /var/log/jobboard

# Run the application and redirect output to log file
nohup bash scripts/start.sh > $LOG_FILE 2>&1 &

# Print the PID
echo "Application started with PID $!"
echo "Logs are being written to $LOG_FILE"
echo "To view logs: tail -f $LOG_FILE"