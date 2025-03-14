# Job Board API

A RESTful API for a job board application built with Spring Boot and MySQL.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Data Model](#data-model)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [Understanding Spring Boot](#understanding-spring-boot)
- [Understanding MySQL with Spring Boot](#understanding-mysql-with-spring-boot)

## Overview

This application provides a RESTful API for a job board where users can:
- Create job listings
- View all job listings
- View details of a specific job
- Update job listings
- Delete job listings
- Search for jobs by title, company, or location

## Technology Stack

- **Java 17**: The programming language used
- **Spring Boot 3.2.5**: Framework for creating stand-alone, production-grade Spring-based applications
- **Spring Data JPA**: Simplifies data access layer implementation
- **Hibernate**: ORM (Object-Relational Mapping) tool for database interaction
- **MySQL**: Relational database for storing job data
- **Maven**: Dependency management and build tool
- **JUnit 5**: Testing framework
- **Mockito**: Mocking framework for unit tests
- **Spring Test**: Tools for testing Spring applications

## Project Structure

The application follows a standard layered architecture:

```
jobboard/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── example/
│   │   │           └── jobboard/
│   │   │               ├── JobBoardApplication.java (Entry point)
│   │   │               ├── controller/
│   │   │               │   ├── JobController.java (REST endpoints)
│   │   │               │   └── GlobalExceptionHandler.java (Error handling)
│   │   │               ├── model/
│   │   │               │   └── Job.java (Entity class)
│   │   │               ├── repository/
│   │   │               │   └── JobRepository.java (Data access)
│   │   │               └── service/
│   │   │                   ├── JobService.java (Service interface)
│   │   │                   └── JobServiceImpl.java (Service implementation)
│   │   └── resources/
│   │       └── application.properties (Configuration)
│   └── test/
│       └── java/
│           └── com/
│               └── example/
│                   └── jobboard/
│                       ├── controller/
│                       │   └── JobControllerTest.java
│                       ├── service/
│                       │   └── JobServiceImplTest.java
│                       └── integration/
│                           └── JobControllerIntegrationTest.java
├── scripts/
│   ├── start.sh (Script to start the application)
│   ├── dev.sh (Script to run in development mode)
│   ├── build.sh (Script to build the application)
│   ├── test.sh (Script to run tests)
│   └── test-api.sh (Script to test the API)
└── pom.xml (Dependencies and build configuration)
```

## API Endpoints

| Method | URL                           | Description                      | Request Body | Response                  |
|--------|-------------------------------|----------------------------------|--------------|---------------------------|
| GET    | /api/jobs                     | Get all jobs                     | -            | Array of Job objects      |
| GET    | /api/jobs/{id}                | Get job by ID                    | -            | Job object                |
| POST   | /api/jobs                     | Create a new job                 | Job object   | Created Job object        |
| PUT    | /api/jobs/{id}                | Update a job                     | Job object   | Updated Job object        |
| DELETE | /api/jobs/{id}                | Delete a job                     | -            | 204 No Content            |
| GET    | /api/jobs/search/title?title= | Search jobs by title             | -            | Array of matching Jobs    |
| GET    | /api/jobs/search/company?company= | Search jobs by company       | -            | Array of matching Jobs    |
| GET    | /api/jobs/search/location?location= | Search jobs by location    | -            | Array of matching Jobs    |

## Data Model

### Job Entity

| Field         | Type           | Description                                |
|---------------|----------------|--------------------------------------------|
| id            | Long           | Primary key, auto-generated                |
| title         | String         | Job title (required)                       |
| company       | String         | Company name (required)                    |
| location      | String         | Job location (required)                    |
| description   | String         | Job description (required)                 |
| requirements  | String         | Job requirements (optional)                |
| salary        | Double         | Job salary (required)                      |
| contactEmail  | String         | Contact email (optional)                   |
| postedDate    | LocalDateTime  | Date and time when the job was posted      |

## Setup and Installation

### Prerequisites

- Java 17 or higher
- Maven
- MySQL

### MySQL Setup

The application requires a MySQL database. You can use the provided `mysql.sh` script to manage your MySQL instance:

```bash
# Check MySQL status
bash scripts/mysql.sh status

# Start MySQL
bash scripts/mysql.sh start

# Stop MySQL
bash scripts/mysql.sh stop

# Restart MySQL
bash scripts/mysql.sh restart

# Create the jobboard database
bash scripts/mysql.sh create

# Show connection information
bash scripts/mysql.sh info

# Show help
bash scripts/mysql.sh help
```

### Database Configuration

The application is configured to connect to a MySQL database with the following default settings:

- Database: `jobboard`
- Username: `root`
- Password: `` (empty)
- Host: `localhost`
- Port: `3306`

You can modify these settings in `src/main/resources/application.properties`.

## Running the Application

This project includes shell scripts to make it easier to build, run, and test the application.

### Using Shell Scripts

```bash
# Start the application
bash scripts/start.sh

# Run in development mode with auto-restart on file changes
bash scripts/dev.sh

# Build the application
bash scripts/build.sh

# Run all tests
bash scripts/test.sh

# Run only unit tests
bash scripts/test.sh unit

# Run only API tests
bash scripts/test.sh api
```

### Traditional Method

You can also use the traditional Maven and Java commands:

```bash
# Build the application
mvn clean install

# Run the application
java -jar target/jobboard-1.0-SNAPSHOT.jar

# Run tests
mvn test
```

## Running Tests

### Unit Tests

Run the unit tests with:

```bash
mvn test
```

### API Tests

1. Make sure the application is running
2. Run the API test script:
   ```bash
   bash scripts/test-api.sh
   ```

## Understanding Spring Boot

Spring Boot is a framework that simplifies the development of Java applications, particularly web applications and microservices. It's built on top of the Spring Framework but eliminates much of the boilerplate configuration required in traditional Spring applications.

### Key Concepts in Spring Boot

1. **Auto-configuration**: Spring Boot automatically configures your application based on the dependencies you've added to your project. For example, if you add the `spring-boot-starter-data-jpa` dependency, Spring Boot will automatically configure a data source and an entity manager.

2. **Starters**: Spring Boot provides "starter" dependencies that simplify your build configuration. For example, `spring-boot-starter-web` includes everything needed for building web applications, including Spring MVC.

3. **Embedded Server**: Spring Boot includes an embedded web server (Tomcat, Jetty, or Undertow) so you can run your application as a standalone JAR file without deploying to an external server.

4. **Actuator**: Spring Boot Actuator provides production-ready features like health checks, metrics, and monitoring.

### Spring Boot Components Used in This Project

1. **Spring MVC**: Used for building the REST API endpoints in `JobController.java`.

2. **Spring Data JPA**: Simplifies database operations through repositories like `JobRepository.java`.

3. **Validation**: Used for validating request data with annotations like `@NotBlank` and `@NotNull`.

4. **Exception Handling**: Global exception handling with `@ControllerAdvice` in `GlobalExceptionHandler.java`.

5. **Testing**: Spring Boot provides testing utilities for unit and integration tests.

## Understanding MySQL with Spring Boot

MySQL is a popular open-source relational database management system. Spring Boot makes it easy to integrate with MySQL through Spring Data JPA and Hibernate.

### How Spring Boot Connects to MySQL

1. **Dependencies**: The project includes the MySQL Connector and Spring Data JPA dependencies in the `pom.xml` file.

2. **Configuration**: Database connection details are specified in `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/jobboard?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   ```

3. **Hibernate Configuration**: Spring Boot configures Hibernate (the ORM) with settings like:
   ```properties
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
   ```

### Entity-Relationship Mapping

1. **Entity Class**: The `Job.java` class is annotated with `@Entity` to mark it as a JPA entity that maps to a database table.

2. **Table Mapping**: The `@Table(name = "jobs")` annotation specifies the table name in the database.

3. **Column Mapping**: Each field in the entity class maps to a column in the database table.

4. **ID Generation**: The `@Id` and `@GeneratedValue` annotations define the primary key and its generation strategy.

### Repository Pattern

1. **JpaRepository**: The `JobRepository` interface extends `JpaRepository`, which provides CRUD operations and pagination support.

2. **Custom Queries**: Custom query methods like `findByTitleContainingIgnoreCase` are defined in the repository interface, and Spring Data JPA automatically implements them.

3. **Transaction Management**: Spring Boot handles transaction management automatically, ensuring data consistency.

### Benefits of Using MySQL with Spring Boot

1. **Simplified Configuration**: Spring Boot reduces the amount of configuration needed to connect to MySQL.

2. **ORM Integration**: Hibernate (as the JPA provider) handles the mapping between Java objects and database tables.

3. **Connection Pooling**: HikariCP (included with Spring Boot) provides efficient connection pooling.

4. **Database Migrations**: Spring Boot can automatically create or update the database schema based on entity classes.

5. **Testing Support**: Spring Boot provides utilities for testing with an in-memory database or with the actual MySQL database.

This combination of Spring Boot and MySQL provides a robust foundation for building data-driven applications with minimal boilerplate code. 