# Loon
Music Player

## Feature Summary
* User management
* Comprehensive logging
* Built-in database backups

## Getting Started

### Prerequisites
* Gradle
* Tomcat 8

### Installing
1. Clone project
2. Build with Gradle

## Deployment (WIP)
1. Build war file with Gradle
2. Copy war file to tomcat webapps directory
3. Place DB driver jar file for H2 or Postgres in tomcat/lib (both should be in the war)
4. Set up tomcat's server.xml (there is a server-sample.xml in project source code)
5. Update DB connection info in loon.properties once war file is expanded

## Built With (partial listing)
* [EOI](https://github.com/ehicks05/eoi) - Object relational mapper
* [Reflections](https://github.com/ronmamo/reflections) - Annotation scanning. Used to build URL 
  to method handler mappings (AKA Routes)
* [Cron4J](http://www.sauronsoftware.it/projects/cron4j/index.php) - Job Scheduler
* [Bulma](https://bulma.io/) - CSS framework
