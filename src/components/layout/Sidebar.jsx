import { NavLink, useNavigate } from "react-router-dom";
import {
  Clock,
  FileText,
  FolderKanban,
  Users,
  User,
  LogOut,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../utils/cn";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { to: "/attendance", icon: Clock, label: "출근 기록" },
  { to: "/tasks", icon: FileText, label: "업무 일지" },
  { to: "/projects", icon: FolderKanban, label: "프로젝트" },
  { to: "/team", icon: Users, label: "팀 현황" },
];

export function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-[var(--background)] border-r border-[var(--grayLv2)] flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--grayLv2)]">
          <h1
            className="text-24 text-bold flex items-center gap-2"
            style={{ color: "var(--primary)" }}
          >
            <img
              src="/images/favicon.svg"
              alt=""
              className="inline-block mr-2 w-8 h-8"
            />
            we:connect
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-14 transition-colors",
                      isActive
                        ? "bg-[var(--activation)] text-[var(--primary)] font-medium"
                        : "text-[var(--grayLv4)] hover:bg-[var(--grayLv1)]"
                    )
                  }
                  onClick={onClose}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--grayLv2)] space-y-1">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-14 transition-colors",
                isActive
                  ? "bg-[var(--activation)] text-[var(--primary)] font-medium"
                  : "text-[var(--grayLv4)] hover:bg-[var(--grayLv1)]"
              )
            }
            onClick={onClose}
          >
            <User className="h-5 w-5" />내 프로필
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-14 text-[var(--error)] hover:bg-[var(--grayLv1)] w-full transition-colors"
          >
            <LogOut className="h-5 w-5" />
            로그아웃
          </button>
        </div>
      </aside>
    </>
  );
}
