
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY . .
RUN ./gradlew build -x test
EXPOSE 8080
CMD ["java", "-jar", "build/libs/app.jar"]


# Step 1: Use an official Java image with JDK 17
# Step 2: Set the working directory inside the container
# Step 3: Copy everything from your local project into the container
# Step 4: Build your app using Gradle (skip tests for faster build)
# Step 5: Expose the default Spring Boot port
# Step 6: Run the JAR file