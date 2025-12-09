import { useState } from "react";
import { ChevronLeft, Plus, Clock, MapPin, MessageCircle, Send, Users, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockQuickNotes, QUICKNOTE_EMOJIS } from "../../mock/teamData";
import { useAppStore } from "../../stores";
import { cn } from "../../utils/cn";
import { getUserByDisplayName } from "../../mock/userData";

export function ActivitiesPage() {
  const navigate = useNavigate();
  const { currentUser: user } = useAppStore();
  const currentUserId = user?.displayName || "Guest";
  const [activities, setActivities] = useState(mockQuickNotes);
  const [selectedType, setSelectedType] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const handleJoin = (activityId) => {
    setActivities((prev) =>
      prev.map((activity) => {
        if (activity.id === activityId) {
          const isParticipant = activity.participants.includes(currentUserId);
          return {
            ...activity,
            participants: isParticipant
              ? activity.participants.filter((p) => p !== currentUserId)
              : [...activity.participants, currentUserId],
          };
        }
        return activity;
      })
    );
  };

  const handleAddComment = (activityId, text) => {
    setActivities((prev) =>
      prev.map((activity) => {
        if (activity.id === activityId) {
          const newComment = {
            id: `c${Date.now()}`,
            text,
            authorId: user?.id || "guest",
            authorName: currentUserId,
            createdAt: new Date().toISOString(),
            checked: false,
          };
          return {
            ...activity,
            comments: [...(activity.comments || []), newComment],
          };
        }
        return activity;
      })
    );
  };

  const handleToggleCommentCheck = (activityId, commentId) => {
    setActivities((prev) =>
      prev.map((activity) => {
        if (activity.id === activityId) {
          return {
            ...activity,
            comments: (activity.comments || []).map((comment) =>
              comment.id === commentId
                ? { ...comment, checked: !comment.checked }
                : comment
            ),
          };
        }
        return activity;
      })
    );
  };

  const handleCloseActivity = (activityId) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === activityId ? { ...activity, closed: true } : activity
      )
    );
  };

  const handleAddActivity = (data) => {
    const newActivity = {
      id: `q${Date.now()}`,
      ...data,
      creatorId: user?.id || "guest",
      creatorName: currentUserId,
      participants: [currentUserId],
      comments: [],
      createdAt: new Date().toISOString(),
    };
    setActivities([newActivity, ...activities]);
    setShowAddModal(false);
  };

  const activeActivities = activities.filter((a) => !a.closed);
  const closedActivities = activities.filter((a) => a.closed);

  const filteredActiveActivities =
    selectedType === "all"
      ? activeActivities
      : activeActivities.filter((a) => a.emoji === selectedType);

  const filteredClosedActivities =
    selectedType === "all"
      ? closedActivities
      : closedActivities.filter((a) => a.emoji === selectedType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/team")}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ChevronLeft size={16} />
          돌아가기
        </button>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800"
        >
          <Plus size={16} />
          추가
        </button>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">조직구성</h1>
        <p className="text-sm text-slate-500 mt-1">
          팀원들과 함께하는 활동을 확인하고 참여하세요
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedType("all")}
          className={cn(
            "px-3 py-1.5 text-sm rounded-lg transition-colors",
            selectedType === "all"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          )}
        >
          전체
        </button>
        {QUICKNOTE_EMOJIS.map((item) => (
          <button
            key={item.emoji}
            onClick={() => setSelectedType(item.emoji)}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors",
              selectedType === item.emoji
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            <span>{item.emoji}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Active Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredActiveActivities.length === 0 && filteredClosedActivities.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-500">
            등록된 활동이 없습니다
          </div>
        ) : filteredActiveActivities.length === 0 ? (
          <div className="col-span-2 text-center py-6 text-slate-400 text-sm">
            진행 중인 활동이 없습니다
          </div>
        ) : (
          filteredActiveActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              currentUserId={currentUserId}
              onJoin={handleJoin}
              onAddComment={handleAddComment}
              onToggleCommentCheck={handleToggleCommentCheck}
              onCloseActivity={handleCloseActivity}
            />
          ))
        )}
      </div>

      {/* Closed Activities */}
      {filteredClosedActivities.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-slate-500 mb-4">완료된 활동</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClosedActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                currentUserId={currentUserId}
                onJoin={handleJoin}
                onAddComment={handleAddComment}
                onToggleCommentCheck={handleToggleCommentCheck}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <AddActivityModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddActivity}
        />
      )}
    </div>
  );
}

function ActivityCard({ activity, currentUserId, onJoin, onAddComment, onToggleCommentCheck, onCloseActivity }) {
  const isParticipant = activity.participants.includes(currentUserId);
  const isOwner = activity.creatorName === currentUserId;
  const isClosed = activity.closed;
  const [showComments, setShowComments] = useState(true);
  const [commentText, setCommentText] = useState("");
  const comments = activity.comments || [];

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || isClosed) return;
    onAddComment(activity.id, commentText.trim());
    setCommentText("");
  };

  const getAuthorProfile = (authorName) => {
    const user = getUserByDisplayName(authorName);
    return user?.profileImage || null;
  };

  return (
    <div className={cn(
      "rounded-lg border p-4",
      isClosed ? "bg-slate-50 border-slate-100 opacity-75" : "bg-white border-slate-200"
    )}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="text-2xl">{activity.emoji}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className={cn(
              "font-semibold",
              isClosed ? "text-slate-500" : "text-slate-800"
            )}>
              {activity.content}
            </h3>
            {isClosed && (
              <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                마감
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
            <span>{activity.creatorName}</span>
            {activity.date && (
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {activity.date}{activity.time && ` ${activity.time}`}
              </span>
            )}
            {!activity.date && activity.time && (
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {activity.time}
              </span>
            )}
            {activity.location && (
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {activity.location}
              </span>
            )}
          </div>
        </div>
        {/* Close Button for Owner */}
        {isOwner && !isClosed && (
          <button
            onClick={() => onCloseActivity?.(activity.id)}
            className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium"
          >
            마감
          </button>
        )}
      </div>

      {/* Participants */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Users size={12} />
          <span>
            {activity.participants.join(", ")} ({activity.participants.length}명)
          </span>
        </div>
        {!isClosed && (
          <button
            onClick={() => onJoin(activity.id)}
            className={cn(
              "px-4 py-2 text-sm rounded-lg transition-colors",
              isParticipant
                ? "bg-blue-50 text-blue-600 font-medium"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {isParticipant ? "참여중" : "참여"}
          </button>
        )}
      </div>

      {/* Comments Section */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 mb-2"
        >
          <MessageCircle size={12} />
          댓글 {comments.length > 0 && `(${comments.length})`}
        </button>

        {showComments && (
          <div className="space-y-2">
            {/* Comment List */}
            {comments.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {comments.map((comment) => {
                  const profileImage = getAuthorProfile(comment.authorName);
                  return (
                    <div
                      key={comment.id}
                      className={cn(
                        "rounded-lg p-2.5 flex items-start gap-2",
                        comment.checked ? "bg-green-50" : "bg-slate-50"
                      )}
                    >
                      {/* Profile Image */}
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt={comment.authorName}
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-xs text-white font-medium shrink-0">
                          {comment.authorName?.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-medium text-slate-700">
                            {comment.authorName}
                          </span>
                          <span className="text-slate-400">
                            {new Date(comment.createdAt).toLocaleTimeString("ko-KR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className={cn(
                          "text-sm mt-1",
                          comment.checked ? "text-green-700 line-through" : "text-slate-600"
                        )}>
                          {comment.text}
                        </p>
                      </div>
                      {/* Check Button */}
                      <button
                        onClick={() => onToggleCommentCheck(activity.id, comment.id)}
                        className={cn(
                          "p-1.5 rounded transition-colors shrink-0",
                          comment.checked
                            ? "bg-green-500 text-white"
                            : "bg-slate-200 text-slate-400 hover:bg-slate-300"
                        )}
                      >
                        <Check size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Comment Input */}
            {!isClosed && (
              <form onSubmit={handleSubmitComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="댓글 입력..."
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
};

function AddActivityModal({ onClose, onSubmit }) {
  const [content, setContent] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(QUICKNOTE_EMOJIS[0].emoji);
  const [date, setDate] = useState(getTodayDate());
  const [time, setTime] = useState(getCurrentTime());
  const [location, setLocation] = useState("");

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
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">조직구성 추가</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
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
