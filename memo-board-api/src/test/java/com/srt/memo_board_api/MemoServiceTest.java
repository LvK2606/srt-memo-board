package com.srt.memo_board_api;

import com.srt.memo_board_api.entity.Memo;
import com.srt.memo_board_api.repository.MemoRepository;
import com.srt.memo_board_api.service.MemoService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class MemoServiceTest {

    @Mock
    private MemoRepository memoRepository;

    @InjectMocks
    private MemoService memoService;

    @Test
    void testToggleMemoStatus() {
        // Giả lập dữ liệu: Một công việc đang CHƯA hoàn thành (false)
        Memo mockMemo = new Memo();
        mockMemo.setId(1L);
        mockMemo.setTitle("Học Java");
        mockMemo.setCompleted(false);

        // Khi Service gọi Database tìm ID = 1, sẽ trả về mockMemo
        when(memoRepository.findById(1L)).thenReturn(Optional.of(mockMemo));
        when(memoRepository.save(mockMemo)).thenReturn(mockMemo);

        // Thực thi hàm đảo trạng thái
        Memo updatedMemo = memoService.toggleMemoStatus(1L);

        // Kiểm tra xem trạng thái có thực sự biến thành TRUE không
        assertEquals(true, updatedMemo.isCompleted());
    }
}