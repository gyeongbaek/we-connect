import { NavLink } from "react-router-dom";

export function NavItem({ icon: Icon, label, to, badge, collapsed, onClick }) {
  return (
    <li>
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            collapsed ? "justify-center" : ""
          } ${
            isActive
              ? "bg-blue-50 text-blue-600 font-medium"
              : "text-gray-600 hover:bg-gray-100"
          }`
        }
        title={collapsed ? label : undefined}
      >
        <Icon size={20} className="flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1">{label}</span>
            {badge && (
              <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                {badge}
              </span>
            )}
          </>
        )}
        {collapsed && badge && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full" />
        )}
      </NavLink>
    </li>
  );
}
