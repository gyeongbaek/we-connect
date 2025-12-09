import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, UIProvider, AttendanceProvider, VacationProvider, TaskProvider } from "./stores";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/layout";
import { LoginPage } from "./features/auth/LoginPage";
import { AttendancePage } from "./features/attendance/AttendancePage";
import { TasksPage } from "./features/tasks/TasksPage";
import { WorkSummaryPage } from "./features/tasks/WorkSummaryPage";
import { ProjectsPage } from "./features/projects/ProjectsPage";
import { ProjectAddPage } from "./features/projects/ProjectAddPage";
import { ProjectDetailPage } from "./features/projects/ProjectDetailPage";
import { ProjectEditPage } from "./features/projects/ProjectEditPage";
import { TeamPage } from "./features/team/TeamPage";
import { ReservationPage } from "./features/reservation/ReservationPage";
import { ProfilePage } from "./features/profile/ProfilePage";

function App() {
  return (
    <AppProvider>
      <UIProvider>
        <AttendanceProvider>
          <VacationProvider>
            <TaskProvider>
              <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/attendance" replace />} />
                  <Route path="attendance" element={<AttendancePage />} />
                  <Route path="tasks" element={<TasksPage />} />
                  <Route path="tasks/summary" element={<WorkSummaryPage />} />
                  <Route path="projects" element={<ProjectsPage />} />
                  <Route path="projects/new" element={<ProjectAddPage />} />
                  <Route path="projects/:projectId" element={<ProjectDetailPage />} />
                  <Route path="projects/:projectId/edit" element={<ProjectEditPage />} />
                  <Route path="team" element={<TeamPage />} />
                  <Route path="reservation" element={<ReservationPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                </Route>
              </Routes>
              </BrowserRouter>
            </TaskProvider>
          </VacationProvider>
        </AttendanceProvider>
      </UIProvider>
    </AppProvider>
  );
}

export default App;
