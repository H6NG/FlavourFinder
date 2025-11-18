
#FROM eclipse-temurin:17-jdk
#WORKDIR /app
#COPY . .
#RUN chmod +x ./gradlew 
#RUN ./gradlew build -x test
#EXPOSE 8080
#CMD ["java", "-jar", "build/libs/javaBackend-1.0-SNAPSHOT.jar"]
#CMD ["sh", "-c", "java -jar build/libs/*.jar"]

# Step 1: Use an official Java image with JDK 17 //openjdk:17-jdk-slim is archived
# Step 2: Set the working directory inside the container
# Step 3: Copy everything from your local project into the container
# Step 4: Build your app using Gradle (skip tests for faster build)
# Step 5: Expose the default Spring Boot port
# Step 6: Run the JAR file //Apparently it'S trying to find a .jar file and run it.
