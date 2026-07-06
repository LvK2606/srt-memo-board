package com.srt.memo_board_api.controller;

import com.srt.memo_board_api.entity.Memo;
import com.srt.memo_board_api.service.MemoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/memos")
@CrossOrigin(origins = "*") // Cho phép Frontend gọi API mà không bị chặn lỗi CORS
public class MemoController {

    @Autowired
    private MemoService memoService;

    // API Lấy danh sách (GET http://localhost:8080/api/memos)
    @GetMapping
    public List<Memo> getAllMemos() {
        return memoService.getAllMemos();
    }

    // API Thêm mới (POST http://localhost:8080/api/memos)
    @PostMapping
    public ResponseEntity<Memo> createMemo(@Valid @RequestBody Memo memo) {
        // @Valid sẽ tự động kiểm tra xem Tiêu đề có bị bỏ trống không (dựa theo cấu hình ở Entity)
        return ResponseEntity.ok(memoService.createMemo(memo));
    }

    // API Cập nhật (PUT http://localhost:8080/api/memos/{id})
    @PutMapping("/{id}")
    public ResponseEntity<Memo> updateMemo(@PathVariable Long id, @Valid @RequestBody Memo memoDetails) {
        return ResponseEntity.ok(memoService.updateMemo(id, memoDetails));
    }

    // API Cập nhật trạng thái hoàn thành (PATCH http://localhost:8080/api/memos/{id}/toggle)
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Memo> toggleMemoStatus(@PathVariable Long id) {
        return ResponseEntity.ok(memoService.toggleMemoStatus(id));
    }

    // API Xóa (DELETE http://localhost:8080/api/memos/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMemo(@PathVariable Long id) {
        memoService.deleteMemo(id);
        return ResponseEntity.ok("Đã xóa công việc thành công!");
    }
}