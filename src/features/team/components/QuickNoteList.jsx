import { Plus, Clock } from "lucide-react";
import { cn } from "../../../utils/cn";

function QuickNoteCard({ note, onJoin, currentUserId }) {
  const isParticipant = note.participants.includes(currentUserId);

  return (
    <div className="p-3 rounded-lg border border-slate-200 bg-white">
      <div className="flex items-start gap-2">
        <span className="text-base">{note.emoji}</span>
        <div className="flex-1">
          <p className="text-sm text-slate-800">{note.content}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
            <span>{note.creatorName}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {note.time}
            </span>
          </div>
        </div>
        <button
          onClick={() => onJoin(note.id)}
          className={cn(
            "px-3 py-1.5 text-xs rounded-lg transition-colors",
            isParticipant
              ? "bg-blue-50 text-blue-600 font-medium"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          )}
        >
          {isParticipant ? "참여중" : "참여"}
        </button>
      </div>

      {/* Participants */}
      {note.participants.length > 0 && (
        <div className="mt-2 pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            {note.participants.join(", ")} ({note.participants.length}명)
          </p>
        </div>
      )}
    </div>
  );
}

export function QuickNoteList({ notes, onAddNote, onJoinNote, currentUserId }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800">퀵노트</h3>
        <button
          onClick={onAddNote}
          className="flex items-center gap-1 px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded transition-colors"
        >
          <Plus size={14} />
          추가
        </button>
      </div>

      {/* Quick Note List */}
      <div className="space-y-3">
        {notes.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">
            등록된 퀵노트가 없습니다
          </p>
        ) : (
          notes.map((note) => (
            <QuickNoteCard
              key={note.id}
              note={note}
              onJoin={onJoinNote}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>
    </div>
  );
}
