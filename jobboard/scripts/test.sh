#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Running Job Board API Tests ===${NC}"
echo ""

# Check if MySQL is running
echo -e "${BLUE}Checking if MySQL is running...${NC}"
if ! mysqladmin ping -h localhost -u root --silent 2>/dev/null; then
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
if ! mysql -u root -e "USE jobboard;" 2>/dev/null; then
    echo -e "${YELLOW}Database 'jobboard' does not exist. Creating it...${NC}"
    if mysql -u root -e "CREATE DATABASE jobboard;" 2>/dev/null; then
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

# Run the tests
echo -e "${BLUE}Running tests...${NC}"
mvn test

# Check if tests passed
if [ $? -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
else
    echo -e "${RED}Some tests failed. Please check the output above for details.${NC}"
    exit 1
fi

# Run API tests if requested
if [ "$1" == "--api" ] || [ "$2" == "--api" ]; then
    echo -e "${BLUE}Running API tests...${NC}"
    
    # Check if the application is running
    if ! curl -s http://localhost:8080/api/jobs > /dev/null; then
        echo -e "${YELLOW}Application is not running. Starting it...${NC}"
        
        # Start the application in the background
        java -jar target/jobboard-1.0-SNAPSHOT.jar > /dev/null 2>&1 &
        APP_PID=$!
        
        # Wait for the application to start
        echo -e "${YELLOW}Waiting for application to start...${NC}"
        sleep 10
        
        # Run the API tests
        bash scripts/test-api.sh
        
        # Kill the application
        echo -e "${YELLOW}Stopping application...${NC}"
        kill $APP_PID
    else
        # Run the API tests
        bash scripts/test-api.sh
    fi
fi

echo -e "${BLUE}=== Tests completed ===${NC}" 