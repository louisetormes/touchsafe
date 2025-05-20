FROM eclipse-temurin:21-jdk as build
WORKDIR /work
COPY target/authkeycloak-1.0.0-SNAPSHOT.jar app.jar
EXPOSE 8989
CMD ["java", "-jar", "app.jar"]
