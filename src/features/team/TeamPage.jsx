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
import { useAuth } from "../../hooks/useAuth";

export function TeamPage() {
  const { user } = useAuth();
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

  return (
    <div className="space-y-8">
      {/* Page Description */}
      <p className="text-sm text-slate-500">
        실시간 팀원 근무 현황과 오늘 일정을 확인합니다
      </p>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Team Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Summary */}
          <div className="flex items-center gap-4 text-sm">
            <span className="font-semibold text-slate-800">
              실시간 근무 현황
            </span>
            <div className="flex items-center gap-4">
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
            </div>
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

          {/* Scheduled Section */}
          <StatusSection
            title="출근 예정"
            members={summary.scheduled}
            variant="scheduled"
          />

          {/* Vacation Section */}
          <StatusSection
            title="휴가"
            members={summary.vacation}
            variant="vacation"
          />
        </div>

        {/* Right Column - Meetings & Quick Notes */}
        <div className="lg:col-span-1 space-y-6">
          <MeetingList meetings={meetings} onAddMeeting={handleAddMeeting} />
          <QuickNoteList
            notes={quickNotes}
            onAddNote={() => setIsQuickNoteModalOpen(true)}
            onJoinNote={handleJoinQuickNote}
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
