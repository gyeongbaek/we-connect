import { useAppStore } from "../../stores";
import {
  Mail,
  Building2,
  Briefcase,
  Award,
  Calendar,
  LogOut,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
  const { currentUser: user, logout } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[var(--grayLv3)]">로그인이 필요합니다.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };

  return (
    <div className="space-y-6">
      <p className="text-14 text-[var(--grayLv3)]">
        내 프로필 정보를 확인합니다
      </p>

      {/* Profile Card */}
      <div className="bg-white rounded-lg border border-[var(--grayLv2)] p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.displayName}
                className="w-20 h-20 rounded-full object-cover  "
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg"
                style={{ backgroundColor: `var(--${user.color || "primary"})` }}
              >
                {user.name?.charAt(0) || user.displayName?.charAt(0)}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h2 className="text-24 text-bold">{user.name}</h2>
              <span className="text-18 text-[var(--grayLv3)]">
                {user.displayName}
              </span>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-12">
                {user.rank}
              </span>
              {user.role && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-12">
                  {user.role}
                </span>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <div className="flex-shrink-0">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              로그아웃
            </Button>
          </div>
        </div>
      </div>

      {/* Detail Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard
          icon={<Mail className="h-5 w-5" />}
          label="이메일"
          value={user.email}
        />
        <InfoCard
          icon={<Building2 className="h-5 w-5" />}
          label="소속"
          value={user.department}
        />
        <InfoCard
          icon={<Briefcase className="h-5 w-5" />}
          label="직무"
          value={user.role || "-"}
        />
        <InfoCard
          icon={<Award className="h-5 w-5" />}
          label="직급"
          value={user.rank}
        />
        <InfoCard
          icon={<Calendar className="h-5 w-5" />}
          label="입사일"
          value={formatDate(user.createdAt)}
        />
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-lg border border-[var(--grayLv2)] p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[var(--grayLv1)] rounded-lg text-[var(--grayLv4)]">
          {icon}
        </div>
        <div>
          <p className="text-12 text-[var(--grayLv3)]">{label}</p>
          <p className="text-14 text-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}
