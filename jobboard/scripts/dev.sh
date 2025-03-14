#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Starting Job Board API in Development Mode ===${NC}"
echo -e "${YELLOW}This will rebuild and restart the application when source files change${NC}"
echo -e "${BLUE}Press Ctrl+C to stop the application${NC}"
echo ""

# Check if MySQL is running
echo -e "${BLUE}Checking if MySQL is running...${NC}"
if ! mysqladmin ping -h localhost -u root -p1R0uh19uD3Cl --silent 2>/dev/null; then
    echo -e "${YELLOW}MySQL is not running. Please start MySQL first:${NC}"
    echo -e "${GREEN}bash scripts/mysql.sh start${NC}"
    echo ""
    echo -e "${YELLOW}Or run this script with the --skip-mysql-check flag to skip this check.${NC}"
    
    # Check if --skip-mysql-check flag is provided
    if [[ "$1" != "--skip-mysql-check" ]]; then
        exit 1
    else
        echo -e "${YELLOW}Skipping MySQL check as requested.${NC}"
    fi
else
    echo -e "${GREEN}MySQL is running.${NC}"
fi

# Check if the database exists
echo -e "${BLUE}Checking if database 'jobboard' exists...${NC}"
if ! mysql -u root -p1R0uh19uD3Cl -e "USE jobboard;" 2>/dev/null; then
    echo -e "${YELLOW}Database 'jobboard' does not exist. Creating it...${NC}"
    if mysql -u root -p1R0uh19uD3Cl -e "CREATE DATABASE jobboard;" 2>/dev/null; then
        echo -e "${GREEN}Database 'jobboard' created successfully.${NC}"
    else
        echo -e "${RED}Failed to create database 'jobboard'. Please create it manually:${NC}"
        echo -e "${GREEN}bash scripts/mysql.sh create${NC}"
        
        # Check if --skip-mysql-check flag is provided
        if [[ "$1" != "--skip-mysql-check" ]]; then
            exit 1
        else
            echo -e "${YELLOW}Continuing anyway as requested.${NC}"
        fi
    fi
else
    echo -e "${GREEN}Database 'jobboard' exists.${NC}"
fi

# Function to build and run the application
build_and_run() {
    echo -e "${BLUE}Building application...${NC}"
    mvn clean package -DskipTests
    
    echo -e "${BLUE}Starting application...${NC}"
    echo -e "${GREEN}Application will be available at http://localhost:8080/api/jobs${NC}"
    echo ""
    
    # Run the application in the background
    java -jar target/jobboard-1.0-SNAPSHOT.jar &
    APP_PID=$!
    
    echo -e "${YELLOW}Application running with PID: $APP_PID${NC}"
    echo -e "${YELLOW}Watching for changes...${NC}"
}

# Function to kill the application
kill_app() {
    if [ ! -z "$APP_PID" ]; then
        echo -e "${BLUE}Stopping application (PID: $APP_PID)...${NC}"
        kill $APP_PID
        wait $APP_PID 2>/dev/null
    fi
}

# Handle Ctrl+C
trap 'echo -e "${BLUE}Shutting down...${NC}"; kill_app; exit 0' INT

# Initial build and run
build_and_run

# Watch for changes in source files
while true; do
    # Check for changes in Java files
    CHANGES=$(find src -name "*.java" -newer target/jobboard-1.0-SNAPSHOT.jar 2>/dev/null)
    
    if [ ! -z "$CHANGES" ]; then
        echo -e "${YELLOW}Changes detected. Rebuilding...${NC}"
        kill_app
        build_and_run
    fi
    
    # Sleep for a bit to avoid high CPU usage
    sleep 2
done 