"use client";

import { useState, useEffect } from "react";

interface Memo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export default function Home() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const API_URL = "https://srt-memo-board.onrender.com/api/memos";

  const fetchMemos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setMemos(data);
    } catch (error) { console.error("Lỗi:", error); }
  };

  useEffect(() => { fetchMemos(); }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filter]);

  const handleAddMemo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, description }) });
    setTitle(""); setDescription(""); fetchMemos();
  };

  const handleToggle = async (id: number) => {
    await fetch(`${API_URL}/${id}/toggle`, { method: "PATCH" });
    fetchMemos();
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (currentMemos.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      fetchMemos();
    }
  };

  const startEditing = (memo: Memo) => {
    setEditingId(memo.id);
    setEditTitle(memo.title);
    setEditDescription(memo.description || "");
  };

  const handleSaveEdit = async (id: number) => {
    if (!editTitle.trim()) return;
    await fetch(`${API_URL}/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: editTitle, description: editDescription }) });
    setEditingId(null); fetchMemos();
  };

  const filteredAndSortedMemos = memos
    .filter((memo) => memo.title.toLowerCase().includes(searchQuery.toLowerCase()) && (filter === "ALL" ? true : filter === "COMPLETED" ? memo.completed : !memo.completed))
    .sort((a, b) => {
      if (a.completed === b.completed) {
        return b.id - a.id; 
      }
      return a.completed ? 1 : -1;
    });

  const totalPages = Math.ceil(filteredAndSortedMemos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentMemos = filteredAndSortedMemos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const totalTasks = memos.length;
  const completedTasks = memos.filter(m => m.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 p-4 md:p-8 font-sans transition-colors duration-300">
        
        <div className="max-w-6xl mx-auto flex justify-end mb-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 transition-all text-sm font-bold text-slate-600 dark:text-slate-300"
          >
            {isDarkMode ? "☀️ Chế độ Sáng" : "🌙 Chế độ Tối"}
          </button>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* CỘT TRÁI */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent mb-2">
                Memo Board
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">Quản lý công việc hiệu quả</p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center text-xl font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-800">
                  {progressPercent}%
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tiến độ tổng thể</p>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-blue-500 h-full transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">Đã xong</p>
                  <p className="text-3xl font-black text-emerald-800 dark:text-emerald-300 mt-1">{completedTasks}</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-xl border border-amber-200 dark:border-amber-800/50">
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider">Tồn đọng</p>
                  <p className="text-3xl font-black text-amber-800 dark:text-amber-300 mt-1">{pendingTasks}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAddMemo} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100">Thêm công việc mới</h2>
              <div className="mb-4">
                <input 
                  type="text" 
                  placeholder="Tiêu đề (bắt buộc)..." 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="w-full p-3.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-colors" 
                  required 
                />
              </div>
              <div className="mb-5">
                <textarea 
                  placeholder="Mô tả chi tiết..." 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="w-full p-3.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-colors resize-none" 
                  rows={3} 
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all active:translate-y-0.5">
                + Thêm ngay
              </button>
            </form>
          </div>

          {/* CỘT PHẢI */}
          <div className="w-full lg:w-2/3 space-y-6">
            
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-slate-500 dark:text-slate-400">🔍</span>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm công việc..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-colors" 
                />
              </div>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)} 
                className="px-4 py-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 dark:text-white cursor-pointer sm:w-48 transition-colors"
              >
                <option value="ALL">Tất cả</option>
                <option value="PENDING">Đang chờ</option>
                <option value="COMPLETED">Đã xong</option>
              </select>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 min-h-[500px] flex flex-col">
              <h2 className="text-xl font-bold mb-6 flex justify-between items-center text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-4">
                Danh sách công việc
                <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 py-1 px-3 rounded-full text-sm font-bold">
                  {filteredAndSortedMemos.length}
                </span>
              </h2>

              <div className="flex-1">
                {currentMemos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-500 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50 mt-4">
                    <span className="text-6xl mb-4 grayscale opacity-50">📭</span>
                    <p className="font-medium text-lg">Không tìm thấy công việc nào!</p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {currentMemos.map((memo) => (
                      <li key={memo.id} className={`group flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-xl border transition-all duration-300 ${memo.completed ? "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-70" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm"}`}>
                        
                        {editingId === memo.id ? (
                          <div className="w-full flex flex-col gap-3">
                            <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full p-2 border-b-2 border-blue-500 bg-transparent text-slate-900 dark:text-white font-bold text-lg focus:outline-none" autoFocus />
                            <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-300 resize-none focus:outline-none" rows={2} />
                            <div className="flex gap-3 justify-end mt-2">
                              <button onClick={() => handleSaveEdit(memo.id)} className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-600 transition-colors">Lưu</button>
                              <button onClick={() => setEditingId(null)} className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-2 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Hủy</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start space-x-4 w-full sm:w-3/4">
                              
                              {/* THIẾT KẾ LẠI: NÚT TOGGLE CÓ ICON BÊN TRONG CỤC TRÒN */}
                              <div className="pt-1 flex-shrink-0">
                                <button
                                  onClick={() => handleToggle(memo.id)}
                                  className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                                    memo.completed ? 'bg-emerald-800' : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                                  }`}
                                  title={memo.completed ? "Đánh dấu chưa xong" : "Đánh dấu đã xong"}
                                >
                                  <span
                                    className={`inline-flex items-center justify-center h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                                      memo.completed ? 'translate-x-9' : 'translate-x-1'
                                    }`}
                                  >
                                    {memo.completed ? (
                                      // Icon Dấu Tích (✓) màu xanh đậm
                                      <svg className="w-4 h-4 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    ) : (
                                      // Icon Dấu Nhân (✕) màu xám
                                      <svg className="w-4 h-4 text-slate-300 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    )}
                                  </span>
                                </button>
                              </div>

                              <div className="flex-1 break-words ml-2">
                                <h3 className={`font-bold text-lg transition-colors ${memo.completed ? "line-through decoration-2 decoration-slate-400 text-slate-400 dark:text-slate-500" : "text-slate-800 dark:text-slate-100"}`}>
                                  {memo.title}
                                </h3>
                                {memo.description && (
                                  <p className={`text-sm mt-1 whitespace-pre-wrap transition-colors ${memo.completed ? "line-through decoration-slate-300 text-slate-400 dark:text-slate-500" : "text-slate-600 dark:text-slate-400"}`}>
                                    {memo.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex space-x-3 mt-4 sm:mt-0 w-full sm:w-auto justify-end sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300">
                              <button onClick={() => startEditing(memo)} className="bg-white dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 font-bold px-4 py-2 rounded-xl border border-blue-200 dark:border-transparent transition-colors">
                                Sửa
                              </button>
                              <button onClick={() => handleDelete(memo.id)} className="bg-white dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 font-bold px-4 py-2 rounded-xl border border-red-200 dark:border-transparent transition-colors">
                                Xóa
                              </button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-300 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-bold shadow-sm"
                  >
                    ← Trước
                  </button>
                  
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    Trang <span className="text-blue-600 dark:text-blue-400 font-bold">{currentPage}</span> / {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-300 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-bold shadow-sm"
                  >
                    Sau →
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}