import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Clock,
  FileText,
  FolderKanban,
  Users,
  CalendarDays,
  LogOut,
  Menu,
  ChevronLeft,
  X,
} from "lucide-react";
import { NavItem } from "../../common/components";
import { Header } from "./Header";
import { useAppStore, useUIStore } from "../../stores";

const pageTitles = {
  "/attendance": "근무 기록",
  "/tasks": "업무 일지",
  "/projects": "프로젝트",
  "/team": "팀 현황",
  "/reservation": "예약",
  "/profile": "내 프로필",
};

// 사이드바 헤더 컴포넌트
function SidebarHeader({ collapsed, isMobile, onClose, onToggle }) {
  return (
    <div
      className={`p-4 border-b border-gray-100 flex items-center ${
        collapsed ? "justify-center" : "justify-between"
      }`}
    >
      {!collapsed && (
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <img
            src="/images/favicon.svg"
            alt="we:connect"
            className="w-6 h-6 rounded-lg"
          />
          <span>
            we<span className="text-blue-600">:connect</span>
          </span>
        </h1>
      )}
      {collapsed && (
        <img
          src="/images/favicon.svg"
          alt="we:connect"
          className="w-6 h-6 rounded-lg"
        />
      )}
      {isMobile ? (
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
          aria-label="사이드바 닫기"
        >
          <X size={20} />
        </button>
      ) : (
        !collapsed && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hidden lg:block"
            aria-label="사이드바 접기"
          >
            <ChevronLeft size={20} />
          </button>
        )
      )}
    </div>
  );
}

// 사이드바 네비게이션 컴포넌트
function SidebarNav({ collapsed, isMobile, onToggle, onNavClick }) {
  return (
    <nav className="flex-1 p-3">
      {collapsed && !isMobile && (
        <button
          onClick={onToggle}
          className="w-full flex justify-center p-2 mb-2 rounded-lg hover:bg-gray-100 text-gray-500"
          aria-label="사이드바 펼치기"
        >
          <Menu size={20} />
        </button>
      )}

      <ul className="space-y-1">
        <NavItem
          icon={Clock}
          label="근무 기록"
          to="/attendance"
          collapsed={collapsed}
          onClick={isMobile ? onNavClick : undefined}
        />
        <NavItem
          icon={FileText}
          label="업무 일지"
          to="/tasks"
          badge="2"
          collapsed={collapsed}
          onClick={isMobile ? onNavClick : undefined}
        />
        <NavItem
          icon={FolderKanban}
          label="프로젝트"
          to="/projects"
          collapsed={collapsed}
          onClick={isMobile ? onNavClick : undefined}
        />
        <NavItem
          icon={Users}
          label="팀 현황"
          to="/team"
          collapsed={collapsed}
          onClick={isMobile ? onNavClick : undefined}
        />
        <NavItem
          icon={CalendarDays}
          label="예약"
          to="/reservation"
          collapsed={collapsed}
          onClick={isMobile ? onNavClick : undefined}
        />
      </ul>
    </nav>
  );
}

// 사이드바 푸터 컴포넌트
function SidebarFooter({ collapsed, currentUser, onProfileClick, onLogout }) {
  return (
    <div className="p-3 border-t border-gray-100">
      <div
        className={`flex items-center gap-2 px-2  pl-1 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
          collapsed ? "justify-center" : ""
        }`}
        onClick={onProfileClick}
        title={collapsed ? currentUser?.displayName : undefined}
      >
        <img
          src={
            currentUser?.profileImage ||
            `/images/profiles/${currentUser?.displayName?.toLowerCase()}.png`
          }
          alt={currentUser?.displayName}
          className="w-8 h-8 rounded-full object-cover shrink-0"
        />
        {!collapsed && (
          <div className="flex-1 min-w-0 ">
            <p className="text-sm font-medium text-gray-900 truncate flex items-center">
              {currentUser?.name}
              <span className="text-xs text-gray-500 ml-1">
                {currentUser?.displayName}
              </span>
            </p>
          </div>
        )}
      </div>

      <button
        onClick={onLogout}
        title={collapsed ? "로그아웃" : undefined}
        className={`w-full mt-2 flex items-center gap-2 p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <LogOut size={16} className="shrink-0" />
        {!collapsed && <span className="text-xs">로그아웃</span>}
      </button>
    </div>
  );
}

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAppStore();
  const {
    sidebarCollapsed,
    toggleSidebar,
    sidebarOpen,
    toggleMobileSidebar,
    closeMobileSidebar,
  } = useUIStore();

  const title = pageTitles[location.pathname] || "대시보드";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavClick = () => {
    closeMobileSidebar();
  };

  const handleProfileClick = (isMobile) => {
    navigate("/profile");
    if (isMobile) closeMobileSidebar();
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* 모바일 사이드바 */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarHeader
          collapsed={false}
          isMobile={true}
          onClose={closeMobileSidebar}
          onToggle={toggleSidebar}
        />
        <SidebarNav
          collapsed={false}
          isMobile={true}
          onToggle={toggleSidebar}
          onNavClick={handleNavClick}
        />
        <SidebarFooter
          collapsed={false}
          currentUser={currentUser}
          onProfileClick={() => handleProfileClick(true)}
          onLogout={handleLogout}
        />
      </aside>

      {/* 데스크톱 사이드바 */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-56"
        }`}
      >
        <SidebarHeader
          collapsed={sidebarCollapsed}
          isMobile={false}
          onClose={closeMobileSidebar}
          onToggle={toggleSidebar}
        />
        <SidebarNav
          collapsed={sidebarCollapsed}
          isMobile={false}
          onToggle={toggleSidebar}
          onNavClick={handleNavClick}
        />
        <SidebarFooter
          collapsed={sidebarCollapsed}
          currentUser={currentUser}
          onProfileClick={() => handleProfileClick(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} onMenuClick={toggleMobileSidebar} />

        <main className="flex-1 overflow-auto px-6 pb-6 lg:px-8 lg:pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
