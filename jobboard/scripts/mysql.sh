#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# MySQL configuration
DB_NAME="jobboard"
DB_USER="root"
DB_PASSWORD=""

# Function to check if MySQL is running
check_mysql_status() {
    echo -e "${BLUE}Checking MySQL status...${NC}"
    
    # Try to connect to MySQL
    if mysqladmin ping -h localhost -u $DB_USER --silent 2>/dev/null; then
        echo -e "${GREEN}MySQL is running.${NC}"
        return 0
    else
        echo -e "${RED}MySQL is not running.${NC}"
        return 1
    fi
}

# Function to start MySQL
start_mysql() {
    echo -e "${BLUE}Starting MySQL...${NC}"
    
    # Check if MySQL is already running
    if check_mysql_status; then
        echo -e "${YELLOW}MySQL is already running.${NC}"
        return 0
    fi
    
    # Detect OS and start MySQL accordingly
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew services start mysql
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo service mysql start || sudo systemctl start mysql
    else
        echo -e "${RED}Unsupported operating system. Please start MySQL manually.${NC}"
        return 1
    fi
    
    # Check if MySQL started successfully
    sleep 2
    if check_mysql_status; then
        echo -e "${GREEN}MySQL started successfully.${NC}"
        return 0
    else
        echo -e "${RED}Failed to start MySQL. Please start it manually.${NC}"
        return 1
    fi
}

# Function to stop MySQL
stop_mysql() {
    echo -e "${BLUE}Stopping MySQL...${NC}"
    
    # Check if MySQL is already stopped
    if ! check_mysql_status; then
        echo -e "${YELLOW}MySQL is already stopped.${NC}"
        return 0
    fi
    
    # Detect OS and stop MySQL accordingly
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew services stop mysql
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo service mysql stop || sudo systemctl stop mysql
    else
        echo -e "${RED}Unsupported operating system. Please stop MySQL manually.${NC}"
        return 1
    fi
    
    # Check if MySQL stopped successfully
    sleep 2
    if ! check_mysql_status; then
        echo -e "${GREEN}MySQL stopped successfully.${NC}"
        return 0
    else
        echo -e "${RED}Failed to stop MySQL. Please stop it manually.${NC}"
        return 1
    fi
}

# Function to restart MySQL
restart_mysql() {
    echo -e "${BLUE}Restarting MySQL...${NC}"
    
    stop_mysql
    sleep 2
    start_mysql
}

# Function to create the database
create_database() {
    echo -e "${BLUE}Creating database '$DB_NAME' if it doesn't exist...${NC}"
    
    # Check if MySQL is running
    if ! check_mysql_status; then
        echo -e "${YELLOW}MySQL is not running. Starting MySQL...${NC}"
        start_mysql
    fi
    
    # Create the database
    if mysql -u $DB_USER -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;" 2>/dev/null; then
        echo -e "${GREEN}Database '$DB_NAME' is ready.${NC}"
        return 0
    else
        echo -e "${RED}Failed to create database '$DB_NAME'.${NC}"
        return 1
    fi
}

# Function to show MySQL connection info
show_connection_info() {
    echo -e "${BLUE}MySQL Connection Information:${NC}"
    echo -e "${GREEN}Host:${NC} localhost"
    echo -e "${GREEN}Port:${NC} 3306"
    echo -e "${GREEN}Database:${NC} $DB_NAME"
    echo -e "${GREEN}Username:${NC} $DB_USER"
    echo -e "${GREEN}Password:${NC} $DB_PASSWORD"
    echo ""
    echo -e "${BLUE}Connection URL:${NC}"
    echo -e "${GREEN}jdbc:mysql://localhost:3306/$DB_NAME?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true${NC}"
}

# Function to show help
show_help() {
    echo -e "${BLUE}MySQL Management Script${NC}"
    echo -e "Usage: bash scripts/mysql.sh [command]"
    echo ""
    echo -e "Commands:"
    echo -e "  ${GREEN}status${NC}     Check if MySQL is running"
    echo -e "  ${GREEN}start${NC}      Start MySQL"
    echo -e "  ${GREEN}stop${NC}       Stop MySQL"
    echo -e "  ${GREEN}restart${NC}    Restart MySQL"
    echo -e "  ${GREEN}create${NC}     Create the database"
    echo -e "  ${GREEN}info${NC}       Show MySQL connection information"
    echo -e "  ${GREEN}help${NC}       Show this help message"
    echo ""
    echo -e "Example:"
    echo -e "  ${GREEN}bash scripts/mysql.sh start${NC}"
}

# Parse command line arguments
case "$1" in
    status)
        check_mysql_status
        ;;
    start)
        start_mysql
        ;;
    stop)
        stop_mysql
        ;;
    restart)
        restart_mysql
        ;;
    create)
        create_database
        ;;
    info)
        show_connection_info
        ;;
    help|*)
        show_help
        ;;
esac 