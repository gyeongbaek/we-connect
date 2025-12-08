import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { ProjectForm } from "./components/ProjectForm";
import { Button } from "../../components/ui/button";
import { mockProjectsData } from "../../mock/projectData";

export function ProjectEditPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  // TODO: API 연동 시 실제 데이터 fetch로 교체
  // localStorage와 mockData 모두 확인
  const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
  const allProjects = [...storedProjects, ...mockProjectsData];
  const project = allProjects.find((p) => p.id === projectId);

  const handleSubmit = (projectData) => {
    // TODO: API 연동 시 실제 저장 로직으로 교체
    console.log("프로젝트 수정:", projectData);

    // 임시: localStorage 업데이트
    const existingProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const updatedProjects = existingProjects.map((p) =>
      p.id === projectData.id ? projectData : p
    );

    // 기존 mockData에 있던 프로젝트인 경우 localStorage에 추가
    if (!existingProjects.find((p) => p.id === projectData.id)) {
      updatedProjects.push(projectData);
    }

    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    navigate("/projects");
  };

  const handleCancel = () => {
    navigate("/projects");
  };

  const handleDelete = () => {
    if (window.confirm("정말 이 프로젝트를 삭제하시겠습니까?")) {
      // TODO: API 연동 시 실제 삭제 로직으로 교체
      console.log("프로젝트 삭제:", projectId);

      const existingProjects = JSON.parse(localStorage.getItem("projects") || "[]");
      const updatedProjects = existingProjects.filter((p) => p.id !== projectId);
      localStorage.setItem("projects", JSON.stringify(updatedProjects));

      // mockData에 있는 프로젝트 삭제 표시
      const deletedProjects = JSON.parse(localStorage.getItem("deletedProjects") || "[]");
      if (!deletedProjects.includes(projectId)) {
        deletedProjects.push(projectId);
        localStorage.setItem("deletedProjects", JSON.stringify(deletedProjects));
      }

      navigate("/projects");
    }
  };

  if (!project) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-14 text-[var(--grayLv3)] hover:text-[var(--grayLv4)] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            프로젝트 목록으로
          </button>
        </div>
        <div className="bg-[var(--background)] rounded-lg border border-[var(--grayLv2)] p-6 text-center">
          <p className="text-[var(--grayLv3)]">프로젝트를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-24 text-semibold">프로젝트 수정</h1>
            <p className="text-14 text-[var(--grayLv3)] mt-1">
              프로젝트 정보를 수정해주세요
            </p>
          </div>
          <Button
            variant="ghost"
            className="text-[var(--error)] hover:text-[var(--error)] hover:bg-[var(--error)]/10"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            삭제
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-[var(--background)] rounded-lg border border-[var(--grayLv2)] p-6">
        <ProjectForm
          project={project}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="저장"
        />
      </div>
    </div>
  );
}
