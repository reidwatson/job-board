#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Building Job Board API ===${NC}"
echo ""

# Check if MySQL is running (only needed for tests)
if [ "$1" != "--skip-tests" ]; then
    echo -e "${BLUE}Checking if MySQL is running (needed for tests)...${NC}"
    if ! mysqladmin ping -h localhost -u root --silent 2>/dev/null; then
        echo -e "${YELLOW}MySQL is not running. Tests may fail.${NC}"
        echo -e "${YELLOW}You can:${NC}"
        echo -e "${GREEN}1. Start MySQL: bash scripts/mysql.sh start${NC}"
        echo -e "${GREEN}2. Skip tests: bash scripts/build.sh --skip-tests${NC}"
        echo -e "${GREEN}3. Continue anyway and risk test failures${NC}"
        
        read -p "Do you want to continue anyway? (y/n): " choice
        if [[ "$choice" != "y" && "$choice" != "Y" ]]; then
            exit 1
        fi
    else
        echo -e "${GREEN}MySQL is running.${NC}"
        
        # Check if the database exists
        echo -e "${BLUE}Checking if database 'jobboard' exists...${NC}"
        if ! mysql -u root -e "USE jobboard;" 2>/dev/null; then
            echo -e "${YELLOW}Database 'jobboard' does not exist. Creating it...${NC}"
            if mysql -u root -e "CREATE DATABASE jobboard;" 2>/dev/null; then
                echo -e "${GREEN}Database 'jobboard' created successfully.${NC}"
            else
                echo -e "${RED}Failed to create database 'jobboard'. Tests may fail.${NC}"
                echo -e "${YELLOW}You can:${NC}"
                echo -e "${GREEN}1. Create the database: bash scripts/mysql.sh create${NC}"
                echo -e "${GREEN}2. Skip tests: bash scripts/build.sh --skip-tests${NC}"
                echo -e "${GREEN}3. Continue anyway and risk test failures${NC}"
                
                read -p "Do you want to continue anyway? (y/n): " choice
                if [[ "$choice" != "y" && "$choice" != "Y" ]]; then
                    exit 1
                fi
            fi
        else
            echo -e "${GREEN}Database 'jobboard' exists. Data will be preserved.${NC}"
        fi
    fi
fi

# Build the application
echo -e "${BLUE}Building application...${NC}"

if [ "$1" == "--skip-tests" ]; then
    echo -e "${YELLOW}Skipping tests...${NC}"
    mvn clean package -DskipTests
else
    mvn clean package
fi

# Check if build was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Build successful!${NC}"
    echo -e "${GREEN}JAR file created at: target/jobboard-1.0-SNAPSHOT.jar${NC}"
    echo ""
    echo -e "${BLUE}You can now run the application with:${NC}"
    echo -e "${GREEN}bash scripts/start.sh${NC}"
else
    echo -e "${RED}Build failed. Please check the errors above.${NC}"
    exit 1
fi 