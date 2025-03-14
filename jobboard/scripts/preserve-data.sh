#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Starting Job Board API (Preserving Data) ===${NC}"
echo -e "${BLUE}Press Ctrl+C to stop the application${NC}"
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
    echo -e "${GREEN}Database 'jobboard' exists. Data will be preserved.${NC}"
fi

# Check if the JAR file exists
if [ ! -f "target/jobboard-1.0-SNAPSHOT.jar" ]; then
    echo -e "${RED}JAR file not found. Please build the application first:${NC}"
    echo -e "${GREEN}bash scripts/build.sh${NC}"
    exit 1
fi

# Run the application
echo -e "${BLUE}Starting application...${NC}"
echo -e "${GREEN}Application will be available at http://localhost:8080/api/jobs${NC}"
echo ""

# Execute the jar and keep it in foreground
java -jar target/jobboard-1.0-SNAPSHOT.jar 