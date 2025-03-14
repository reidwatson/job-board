#!/bin/bash

# Simple script to run the web application in detached mode
LOG_FILE="/var/log/jobboard/web.log"

# Create log directory if it doesn't exist
mkdir -p /var/log/jobboard

# Run the application and redirect output to log file
nohup npm run dev > $LOG_FILE 2>&1 &

# Print the PID
echo "Web application started with PID $!"
echo "Logs are being written to $LOG_FILE"
echo "To view logs: tail -f $LOG_FILE" 