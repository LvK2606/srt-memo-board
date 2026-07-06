# Sử dụng môi trường Java 17
FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp
# Copy file build của dự án vào Docker
COPY target/*.jar app.jar
# Lệnh chạy ứng dụng
ENTRYPOINT ["java","-jar","/app.jar"]