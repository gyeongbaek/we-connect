import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ProjectForm } from "./components/ProjectForm";

export function ProjectAddPage() {
  const navigate = useNavigate();

  const handleSubmit = (projectData) => {
    // TODO: API 연동 시 실제 저장 로직으로 교체
    console.log("새 프로젝트 생성:", projectData);

    // 임시: localStorage에 저장하여 프로젝트 목록에 반영
    const existingProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    localStorage.setItem("projects", JSON.stringify([projectData, ...existingProjects]));

    navigate("/projects");
  };

  const handleCancel = () => {
    navigate("/projects");
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-14 text-[var(--grayLv3)] hover:text-[var(--grayLv4)] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          프로젝트 목록으로
        </button>
        <h1 className="text-24 text-semibold">새 프로젝트 만들기</h1>
        <p className="text-14 text-[var(--grayLv3)] mt-1">
          새로운 프로젝트의 정보를 입력해주세요
        </p>
      </div>

      {/* Form */}
      <div className="bg-[var(--background)] rounded-lg border border-[var(--grayLv2)] p-6">
        <ProjectForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="생성하기"
        />
      </div>
    </div>
  );
}
