package com.srt.memo_board_api.service;

import com.srt.memo_board_api.entity.Memo;
import com.srt.memo_board_api.repository.MemoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemoService {

    @Autowired
    private MemoRepository memoRepository;

    // 1. Hiển thị danh sách công việc
    public List<Memo> getAllMemos() {
        return memoRepository.findAll();
    }

    // 2. Thêm công việc mới
    public Memo createMemo(Memo memo) {
        return memoRepository.save(memo);
    }

    // 3. Chỉnh sửa công việc
    public Memo updateMemo(Long id, Memo memoDetails) {
        // Tìm công việc trong database, nếu không có thì ném ra lỗi
        Memo existingMemo = memoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy công việc với ID: " + id));
        
        // Cập nhật thông tin mới
        existingMemo.setTitle(memoDetails.getTitle());
        existingMemo.setDescription(memoDetails.getDescription());
        
        // Lưu lại vào database
        return memoRepository.save(existingMemo);
    }

    // 4. Đánh dấu hoàn thành/chưa hoàn thành
    public Memo toggleMemoStatus(Long id) {
        Memo existingMemo = memoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy công việc với ID: " + id));
        
        // Đảo ngược trạng thái hiện tại (Đang true thành false, đang false thành true)
        existingMemo.setCompleted(!existingMemo.isCompleted());
        
        return memoRepository.save(existingMemo);
    }

    // 5. Xóa công việc
    public void deleteMemo(Long id) {
        Memo existingMemo = memoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy công việc với ID: " + id));
        
        memoRepository.delete(existingMemo);
    }
}