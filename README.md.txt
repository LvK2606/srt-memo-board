# SRT Memo Board (Todo List Application)

Dự án Quản lý công việc (Todo List) được xây dựng phục vụ bài test vị trí Intern Developer tại SRT Group. Ứng dụng áp dụng kiến trúc tách biệt giữa Backend và Frontend, tổ chức mã nguồn rõ ràng theo mô hình MVC/OOP và sở hữu giao diện chuẩn SaaS hiện đại.

## 💻 Tech Stack
- **Backend:** Java 17, Spring Boot 3, Spring Data JPA, Hibernate, Validation.
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS v4.
- **Database:** MySQL.
- **Version Control:** Git.

## 🚀 Hướng dẫn cài đặt và chạy dự án

### 1. Yêu cầu môi trường (Prerequisites)
- [Java JDK 17+](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- [Node.js v18+](https://nodejs.org/)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)

### 2. Cấu hình Database
1. Khởi động MySQL Server.
2. Tạo một Database trống với tên `srt_memo_board` (Collation: `utf8mb4_unicode_ci`).
3. Ứng dụng sẽ tự động khởi tạo bảng `memos` (bao gồm các cột id, title, description, completed, priority, created_at) nhờ cấu hình Hibernate (`ddl-auto=update`).

### 3. Khởi chạy Backend (Spring Boot)
1. Di chuyển vào thư mục Backend: `cd memo-board-api`
2. Đảm bảo cấu hình username/password của MySQL trong file `src/main/resources/application.properties` trùng khớp với máy của bạn.
3. Chạy dự án:
   - Mở bằng IDE (IntelliJ/Eclipse/VS Code) và chạy file `MemoBoardApiApplication.java`.
   - Hoặc chạy qua terminal: `./mvnw spring-boot:run` (Mac/Linux) hoặc `mvnw.cmd spring-boot:run` (Windows).
4. Backend sẽ chạy tại: **http://localhost:8080**

### 4. Khởi chạy Frontend (Next.js)
1. Mở một Terminal mới và di chuyển vào thư mục Frontend: `cd memo-board-web`
2. Cài đặt các thư viện cần thiết (nếu chạy lần đầu): `npm install`
3. Khởi động môi trường dev: `npm run dev`
4. Truy cập ứng dụng trên trình duyệt tại: **http://localhost:3000**

## ✨ Các chức năng & Điểm nổi bật đã hoàn thiện

### 🎨 Giao diện & Trải nghiệm người dùng (UI/UX)
- **Giao diện chuẩn Dashboard:** Layout chia 2 cột tối ưu không gian hiển thị, thiết kế nổi khối (high-contrast).
- **Dark Mode / Light Mode:** Hỗ trợ chuyển đổi chế độ Sáng/Tối mượt mà.
- **Custom Toggle Switch:** Thay thế checkbox mặc định bằng nút gạt công tắc phong cách iOS/macOS có hiệu ứng SVG.
- **Thống kê trực quan:** Hiển thị biểu đồ phần trăm tiến độ, đếm số lượng công việc Đã xong / Tồn đọng theo thời gian thực.

### ⚙️ Tính năng cốt lõi & Logic nghiệp vụ
- **Quản lý linh hoạt:** Thêm, sửa, xóa, tìm kiếm và lọc (Tất cả/Đang chờ/Đã xong) công việc.
- **Phân loại mức độ ưu tiên (Priority):** 
- **Thuật toán sắp xếp thông minh:** Tự động đưa các công việc "Chưa hoàn thành"
- **Phân trang (Pagination):** Chia nhỏ danh sách 5 công việc/trang giúp giao diện gọn gàng, hỗ trợ chuyển trang mượt mà không tải lại.
- **Kiến trúc Backend chuẩn:** Tổ chức mã nguồn chuẩn OOP (Controller - Service - Repository - Entity) và xử lý ngoại lệ (Exception Handling) ở tầng Service.