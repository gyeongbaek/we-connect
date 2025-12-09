import { useState } from "react";
import { LocationGroup } from "./components/LocationGroup";
import { StatusSection } from "./components/StatusSection";
import { MeetingList } from "./components/MeetingList";
import { QuickNoteList } from "./components/QuickNoteList";
import { QuickNoteModal } from "./components/QuickNoteModal";
import {
  mockTeamMembers,
  mockTodayMeetings,
  mockQuickNotes,
  calculateTeamStatusSummary,
} from "../../mock/teamData";
import { useAppStore } from "../../stores";

export function TeamPage() {
  const { currentUser: user } = useAppStore();
  const [teamMembers] = useState(mockTeamMembers);
  const [meetings] = useState(mockTodayMeetings);
  const [quickNotes, setQuickNotes] = useState(mockQuickNotes);
  const [isQuickNoteModalOpen, setIsQuickNoteModalOpen] = useState(false);

  const summary = calculateTeamStatusSummary(teamMembers);
  const currentUserId = user?.displayName || "Guest";

  const handleAddQuickNote = (data) => {
    const newNote = {
      id: `q${Date.now()}`,
      ...data,
      creatorId: user?.id || "guest",
      creatorName: currentUserId,
      participants: [currentUserId],
      createdAt: new Date().toISOString(),
    };
    setQuickNotes([...quickNotes, newNote]);
  };

  const handleJoinQuickNote = (noteId) => {
    setQuickNotes((prev) =>
      prev.map((note) => {
        if (note.id === noteId) {
          const isParticipant = note.participants.includes(currentUserId);
          return {
            ...note,
            participants: isParticipant
              ? note.participants.filter((p) => p !== currentUserId)
              : [...note.participants, currentUserId],
          };
        }
        return note;
      })
    );
  };

  const handleAddMeeting = () => {
    alert("미팅 추가 기능은 추후 구현 예정입니다.");
  };

  const handleAddComment = (noteId, commentText) => {
    setQuickNotes((prev) =>
      prev.map((note) => {
        if (note.id === noteId) {
          const newComment = {
            id: `c${Date.now()}`,
            text: commentText,
            authorId: user?.id || "guest",
            authorName: currentUserId,
            createdAt: new Date().toISOString(),
            checked: false,
          };
          return {
            ...note,
            comments: [...(note.comments || []), newComment],
          };
        }
        return note;
      })
    );
  };

  const handleToggleCommentCheck = (noteId, commentId) => {
    setQuickNotes((prev) =>
      prev.map((note) => {
        if (note.id === noteId) {
          return {
            ...note,
            comments: (note.comments || []).map((comment) =>
              comment.id === commentId
                ? { ...comment, checked: !comment.checked }
                : comment
            ),
          };
        }
        return note;
      })
    );
  };

  const handleCloseNote = (noteId) => {
    setQuickNotes((prev) =>
      prev.map((note) =>
        note.id === noteId ? { ...note, closed: true } : note
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Description */}
      <p className="text-sm text-slate-500">
        실시간 팀원 근무 현황과 오늘 일정을 확인합니다
      </p>

      {/* 모바일: 조직구성 > 오늘미팅 > 팀원현황 순서 */}
      {/* 태블릿: 조직구성/오늘미팅 2열 > 팀원현황 */}
      {/* 데스크톱: 팀원현황(2/3) | 미팅/조직구성(1/3) */}

      {/* 오늘 미팅 / 조직구성 - 모바일 1,2번, 태블릿 2열, 데스크톱 오른쪽 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 lg:hidden">
        {/* 1. 조직구성 */}
        <div className="order-1">
          <QuickNoteList
            notes={quickNotes}
            onAddNote={() => setIsQuickNoteModalOpen(true)}
            onJoinNote={handleJoinQuickNote}
            onAddComment={handleAddComment}
            onToggleCommentCheck={handleToggleCommentCheck}
            onCloseNote={handleCloseNote}
            currentUserId={currentUserId}
          />
        </div>
        {/* 2. 오늘 미팅 */}
        <div className="order-2">
          <MeetingList meetings={meetings} onAddMeeting={handleAddMeeting} />
        </div>
      </div>

      {/* Main Content - 데스크톱 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 팀원 현황 - 모바일 3번(마지막), 데스크톱 왼쪽(2/3) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            {/* Status Summary Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-800">
                  팀원 현황
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-slate-500">
                      {summary.workingCount}명 근무중
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                    <span className="text-slate-500">
                      {summary.scheduledCount}명 예정
                    </span>
                  </span>
                  {summary.vacationCount > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <span className="text-slate-500">
                        {summary.vacationCount}명 휴가
                      </span>
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-slate-400">
                총 {teamMembers.length}명
              </span>
            </div>

            {/* Location Groups */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <LocationGroup
                location="REMOTE"
                members={summary.byLocation.remote}
              />
              <LocationGroup
                location="OFFICE_JEJU"
                members={summary.byLocation.officeJeju}
              />
              <LocationGroup
                location="OFFICE"
                members={summary.byLocation.office}
              />
            </div>

            {/* Scheduled & Vacation Section */}
            {(summary.scheduled.length > 0 || summary.vacation.length > 0) && (
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Scheduled Section */}
                {summary.scheduled.length > 0 && (
                  <StatusSection
                    title="출근 예정"
                    members={summary.scheduled}
                    variant="scheduled"
                  />
                )}

                {/* Vacation Section */}
                {summary.vacation.length > 0 && (
                  <StatusSection
                    title="휴가"
                    members={summary.vacation}
                    variant="vacation"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽 - 데스크톱에서만 표시 */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <MeetingList meetings={meetings} onAddMeeting={handleAddMeeting} />
          <QuickNoteList
            notes={quickNotes}
            onAddNote={() => setIsQuickNoteModalOpen(true)}
            onJoinNote={handleJoinQuickNote}
            onAddComment={handleAddComment}
            onToggleCommentCheck={handleToggleCommentCheck}
            onCloseNote={handleCloseNote}
            currentUserId={currentUserId}
          />
        </div>
      </div>

      {/* Quick Note Modal */}
      <QuickNoteModal
        isOpen={isQuickNoteModalOpen}
        onClose={() => setIsQuickNoteModalOpen(false)}
        onSubmit={handleAddQuickNote}
      />
    </div>
  );
}
