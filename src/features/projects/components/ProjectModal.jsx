import { useState, useEffect } from "react";
import { X, Trash2, Search } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import {
  PROJECT_STATUS,
  PROJECT_TYPES,
  mockTemplates,
} from "../../../mock/projectData";
import { users } from "../../../mock/userData";

export function ProjectModal({ isOpen, onClose, project, onSave, onDelete }) {
  const isEditing = !!project;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "DEVELOPMENT",
    status: "IN_PROGRESS",
    discordLink: "",
    notionLink: "",
    participants: [],
    templateId: "",
  });

  const [participantSearch, setParticipantSearch] = useState("");

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        type: project.type || "OTHER",
        status: project.status,
        discordLink: project.discordLink || "",
        notionLink: project.notionLink || "",
        participants: project.participants || [],
        templateId: "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        type: "DEVELOPMENT",
        status: "IN_PROGRESS",
        discordLink: "",
        notionLink: "",
        participants: [],
        templateId: "",
      });
    }
    setParticipantSearch("");
  }, [project, isOpen]);

  const handleTemplateChange = (templateId) => {
    const template = mockTemplates.find((t) => t.id === templateId);
    if (template) {
      setFormData((prev) => ({
        ...prev,
        templateId,
        type: template.type,
        description: template.defaultDescription,
      }));
    } else {
      setFormData((prev) => ({ ...prev, templateId }));
    }
  };

  const handleParticipantToggle = (userId) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.includes(userId)
        ? prev.participants.filter((id) => id !== userId)
        : [...prev.participants, userId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSave({
      ...formData,
      id: project?.id || `p${Date.now()}`,
      createdAt: project?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const filteredUsers = users.filter((user) =>
    user.displayName.toLowerCase().includes(participantSearch.toLowerCase())
  );

  const selectedParticipants = formData.participants
    .map((id) => users.find((u) => u.id === id))
    .filter(Boolean);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[var(--background)] rounded-lg shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--grayLv2)]">
          <h2 className="text-18 text-semibold">
            {isEditing ? "프로젝트 편집" : "새 프로젝트 만들기"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--grayLv1)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Template (only for new projects) */}
          {!isEditing && (
            <div>
              <label className="block text-14 text-medium mb-1">템플릿</label>
              <Select
                value={formData.templateId}
                onChange={(e) => handleTemplateChange(e.target.value)}
              >
                <option value="">템플릿 선택 (선택사항)</option>
                {mockTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-14 text-medium mb-1">
              프로젝트명 <span className="text-[var(--error)]">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="프로젝트명을 입력하세요"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-14 text-medium mb-1">설명</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="프로젝트 설명을 입력하세요"
              rows={3}
              className="flex w-full rounded-md border border-[var(--grayLv2)] bg-[var(--background)] px-3 py-2 text-14 placeholder:text-[var(--grayLv3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 resize-none"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-14 text-medium mb-1">
              타입 <span className="text-[var(--error)]">*</span>
            </label>
            <Select
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, type: e.target.value }))
              }
            >
              {Object.entries(PROJECT_TYPES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Links */}
          <div>
            <label className="block text-14 text-medium mb-1">
              Discord 링크
            </label>
            <Input
              value={formData.discordLink}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  discordLink: e.target.value,
                }))
              }
              placeholder="https://discord.gg/..."
            />
          </div>
          <div>
            <label className="block text-14 text-medium mb-1">
              Notion 링크
            </label>
            <Input
              value={formData.notionLink}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  notionLink: e.target.value,
                }))
              }
              placeholder="https://notion.so/..."
            />
          </div>

          {/* Participants */}
          <div>
            <label className="block text-14 text-medium mb-2">참가자</label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--grayLv3)]" />
              <Input
                value={participantSearch}
                onChange={(e) => setParticipantSearch(e.target.value)}
                placeholder="팀원 검색..."
                className="pl-9"
              />
            </div>

            {/* Selected participants */}
            {selectedParticipants.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedParticipants.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--primary)] text-white text-12"
                  >
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-10">
                      {user.displayName.charAt(0)}
                    </span>
                    {user.displayName}
                    <button
                      type="button"
                      onClick={() => handleParticipantToggle(user.id)}
                      className="ml-0.5 hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* User list */}
            <div className="max-h-32 overflow-y-auto border border-[var(--grayLv2)] rounded-md">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleParticipantToggle(user.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[var(--grayLv1)] transition-colors ${
                    formData.participants.includes(user.id)
                      ? "bg-[var(--activation)]"
                      : ""
                  }`}
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.displayName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[var(--grayLv2)] flex items-center justify-center text-10 text-semibold">
                      {user.displayName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="text-14">{user.displayName}</div>
                    <div className="text-12 text-[var(--grayLv3)]">
                      {user.role || user.rank}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-14 text-medium mb-2">상태</label>
            <div className="flex gap-2">
              {Object.entries(PROJECT_STATUS).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, status: key }))
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-14 transition-colors ${
                    formData.status === key
                      ? "bg-[var(--surface)] text-white"
                      : "bg-[var(--grayLv1)] text-[var(--surface)] hover:bg-[var(--grayLv2)]"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor:
                        formData.status === key ? "white" : value.color,
                    }}
                  />
                  {value.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--grayLv2)]">
            {isEditing && onDelete ? (
              <Button
                type="button"
                variant="ghost"
                className="text-[var(--error)] hover:text-[var(--error)] hover:bg-[var(--error)]/10"
                onClick={() => onDelete(project.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                삭제
              </Button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                취소
              </Button>
              <Button type="submit">{isEditing ? "저장" : "생성하기"}</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
