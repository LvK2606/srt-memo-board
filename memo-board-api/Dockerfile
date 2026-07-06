# ==========================================
# GIAI ĐOẠN 1: BUILD ỨNG DỤNG (Dùng Maven)
# ==========================================
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Copy toàn bộ mã nguồn Backend vào trong container
COPY . .

# Chạy lệnh build ra file .jar (bỏ qua test để tiết kiệm thời gian deploy)
RUN mvn clean package -DskipTests

# ==========================================
# GIAI ĐOẠN 2: CHẠY ỨNG DỤNG (Chỉ dùng JRE)
# ==========================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy file .jar đã được build thành công từ Giai đoạn 1 sang
COPY --from=builder /app/target/*.jar app.jar

# Khai báo cổng chạy (Mặc định Spring Boot là 8080)
EXPOSE 8080

# Lệnh khởi động ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]