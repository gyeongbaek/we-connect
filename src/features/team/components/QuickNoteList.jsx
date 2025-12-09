import { useState } from "react";
import { Plus, Clock, MapPin, MessageCircle, Send, ChevronDown, ChevronUp, Maximize2, Check } from "lucide-react";
import { cn } from "../../../utils/cn";
import { useNavigate } from "react-router-dom";
import { getUserByDisplayName } from "../../../mock/userData";

function QuickNoteCard({ note, onJoin, onAddComment, onToggleCommentCheck, onCloseNote, currentUserId }) {
  const isParticipant = note.participants.includes(currentUserId);
  const isOwner = note.creatorName === currentUserId;
  const isClosed = note.closed;
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const comments = note.comments || [];

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || isClosed) return;
    onAddComment(note.id, commentText.trim());
    setCommentText("");
  };

  const getAuthorProfile = (authorName) => {
    const user = getUserByDisplayName(authorName);
    return user?.profileImage || null;
  };

  return (
    <div className={cn(
      "p-3 rounded-lg border bg-white",
      isClosed ? "border-slate-100 bg-slate-50 opacity-75" : "border-slate-200"
    )}>
      <div className="flex items-start gap-2">
        <span className="text-base">{note.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={cn(
              "text-sm font-medium",
              isClosed ? "text-slate-500" : "text-slate-800"
            )}>
              {note.content}
            </p>
            {isClosed && (
              <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                마감
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 flex-wrap">
            <span>{note.creatorName}</span>
            {note.date && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  {note.date}{note.time && ` ${note.time}`}
                </span>
              </>
            )}
            {!note.date && note.time && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  {note.time}
                </span>
              </>
            )}
            {note.location && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin size={10} />
                  {note.location}
                </span>
              </>
            )}
          </div>
        </div>
        {/* Close Button for Owner */}
        {isOwner && !isClosed && (
          <button
            onClick={() => onCloseNote?.(note.id)}
            className="px-2 py-1 text-[10px] text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors font-medium"
          >
            마감
          </button>
        )}
      </div>

      {/* Participants */}
      {note.participants.length > 0 && (
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {note.participants.join(", ")} ({note.participants.length}명)
          </p>
          {!isClosed && (
            <button
              onClick={() => onJoin(note.id)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-lg transition-colors shrink-0",
                isParticipant
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {isParticipant ? "참여중" : "참여"}
            </button>
          )}
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
        >
          <MessageCircle size={12} />
          댓글 {comments.length > 0 && `(${comments.length})`}
          {showComments ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        {showComments && (
          <div className="mt-2 space-y-2">
            {/* Comment List */}
            {comments.length > 0 && (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {comments.map((comment) => {
                  const profileImage = getAuthorProfile(comment.authorName);
                  return (
                    <div
                      key={comment.id}
                      className={cn(
                        "rounded p-2 flex items-start gap-2",
                        comment.checked ? "bg-green-50" : "bg-slate-50"
                      )}
                    >
                      {/* Profile Image */}
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt={comment.authorName}
                          className="w-5 h-5 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-300 flex items-center justify-center text-[10px] text-white font-medium shrink-0">
                          {comment.authorName?.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="font-medium text-slate-700">
                            {comment.authorName}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-400">
                            {new Date(comment.createdAt).toLocaleTimeString("ko-KR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className={cn(
                          "text-xs mt-0.5",
                          comment.checked ? "text-green-700 line-through" : "text-slate-600"
                        )}>
                          {comment.text}
                        </p>
                      </div>
                      {/* Check Button */}
                      <button
                        onClick={() => onToggleCommentCheck?.(note.id, comment.id)}
                        className={cn(
                          "p-1 rounded transition-colors shrink-0",
                          comment.checked
                            ? "bg-green-500 text-white"
                            : "bg-slate-200 text-slate-400 hover:bg-slate-300"
                        )}
                      >
                        <Check size={10} />
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
                  className="flex-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="p-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={12} />
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function QuickNoteList({ notes, onAddNote, onJoinNote, onAddComment, onToggleCommentCheck, onCloseNote, currentUserId }) {
  const navigate = useNavigate();

  const activeNotes = notes.filter((n) => !n.closed);
  const closedNotes = notes.filter((n) => n.closed);

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800">조직구성</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate("/team/activities")}
            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded transition-colors"
            title="전체보기"
          >
            <Maximize2 size={14} />
          </button>
          <button
            onClick={onAddNote}
            className="flex items-center gap-1 px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded transition-colors"
          >
            <Plus size={14} />
            추가
          </button>
        </div>
      </div>

      {/* Active Notes */}
      <div className="space-y-3">
        {activeNotes.length === 0 && closedNotes.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">
            등록된 활동이 없습니다
          </p>
        ) : activeNotes.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-2">
            진행 중인 활동이 없습니다
          </p>
        ) : (
          activeNotes.map((note) => (
            <QuickNoteCard
              key={note.id}
              note={note}
              onJoin={onJoinNote}
              onAddComment={onAddComment}
              onToggleCommentCheck={onToggleCommentCheck}
              onCloseNote={onCloseNote}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>

      {/* Closed Notes */}
      {closedNotes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-medium text-slate-400 mb-2">완료된 활동</h4>
          <div className="space-y-2">
            {closedNotes.map((note) => (
              <QuickNoteCard
                key={note.id}
                note={note}
                onJoin={onJoinNote}
                onAddComment={onAddComment}
                onToggleCommentCheck={onToggleCommentCheck}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
