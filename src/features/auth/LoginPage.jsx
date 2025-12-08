import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../stores";
import { users } from "../../mock/userData";

export function LoginPage() {
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAppStore();

  const handleNicknameLogin = async (e) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(nickname.trim());
      navigate("/attendance");
    } catch (err) {
      setError(err.message || "로그인에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (displayName) => {
    setIsLoading(true);
    setError("");
    try {
      await login(displayName);
      navigate("/attendance");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const quickLoginUsers = users.slice(0, 6);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full flex">
        {/* 왼쪽: 환영 메시지 */}
        <div className="flex-1 bg-linear-to-br from-slate-900 to-slate-800 p-10 text-white hidden md:flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <img
                src="/images/favicon.svg"
                alt="we:connect"
                className="w-8 h-8"
              />
              <h2 className="text-2xl font-bold">we:connect</h2>
            </div>
            <h1 className="text-3xl font-bold mb-4">
              위니브에 오신 것을
              <br />
              환영합니다!
            </h1>
            <p className="text-slate-300 leading-relaxed">
              출퇴근 관리, 프로젝트 관리, <br />팀 협업을 한 곳에서 관리하세요.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                📅
              </div>
              <span>출퇴근 및 근무 기록</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                📋
              </div>
              <span>프로젝트 및 업무 관리</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                👥
              </div>
              <span>팀원 현황 및 협업</span>
            </div>
          </div>
        </div>

        {/* 오른쪽: 로그인 폼 */}
        <div className="flex-1 p-10">
          <div className="max-w-sm mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                팀에 참여하기
              </h2>
              <p className="text-slate-500 text-sm">
                닉네임을 입력하여 로그인하세요
              </p>
            </div>

            <form onSubmit={handleNicknameLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  닉네임
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="예: Hati, Binky, Licat"
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  autoFocus
                />
              </div>

              {error && <div className="text-sm text-red-600">※ {error}</div>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </button>
            </form>

            {/* 빠른 로그인 */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-xs text-slate-500 mb-3 text-center">
                빠른 로그인
              </p>
              <div className="grid grid-cols-3 gap-2">
                {quickLoginUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleQuickLogin(user.displayName)}
                    disabled={isLoading}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.displayName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-600 text-white text-sm flex items-center justify-center font-medium">
                        {user.displayName.charAt(0)}
                      </div>
                    )}
                    <span className="text-xs font-medium text-slate-700">
                      {user.displayName}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
