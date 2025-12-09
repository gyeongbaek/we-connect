import { useState } from "react";
import { X } from "lucide-react";
import { QUICKNOTE_EMOJIS } from "../../../mock/teamData";
import { cn } from "../../../utils/cn";
import { getTodayString } from "../../../utils/date";

const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
};

export function QuickNoteModal({ isOpen, onClose, onSubmit }) {
  const [content, setContent] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(QUICKNOTE_EMOJIS[0].emoji);
  const [date, setDate] = useState(getTodayString());
  const [time, setTime] = useState(getCurrentTime());
  const [location, setLocation] = useState("");

  if (!isOpen) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSubmit({
      content: content.trim(),
      emoji: selectedEmoji,
      date: formatDate(date),
      time: time || null,
      location: location.trim() || null,
    });

    setContent("");
    setSelectedEmoji(QUICKNOTE_EMOJIS[0].emoji);
    setDate("");
    setTime("");
    setLocation("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">조직구성 추가</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Emoji Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2">
              타입
            </label>
            <div className="flex gap-2 flex-wrap">
              {QUICKNOTE_EMOJIS.map((item) => (
                <button
                  key={item.emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(item.emoji)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-lg min-w-[52px]",
                    "border transition-colors",
                    selectedEmoji === item.emoji
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-[10px] text-slate-500">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="예: 점심 같이 드실 분~"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2">
              일정
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2">
              장소
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 옥돌해장국, 1층 카페 등"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              추가하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
