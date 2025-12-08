import { Menu, Bell } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function Header({ title, onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-slate-50 flex items-center justify-between px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-1 hover:bg-slate-100 rounded transition-colors"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5 text-slate-600" />
        </button>
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 hover:bg-slate-200 rounded-lg transition-colors">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
        </button>
        {user && (
          <div className="hidden sm:flex items-center gap-2 ml-2">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.displayName}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-sm font-medium">
                {user.displayName?.charAt(0) || user.name?.charAt(0)}
              </div>
            )}
            <span className="text-sm text-slate-800">{user.displayName}</span>
          </div>
        )}
      </div>
    </header>
  );
}
