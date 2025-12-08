import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../hooks/useAuth";
import { users } from "../../mock/userData";

export function LoginPage() {
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

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

  const handleDiscordLogin = () => {
    // Discord OAuth2 로그인 (추후 구현)
    window.location.href = "/api/auth/discord";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--grayLv1)] p-4">
      <div className="w-full max-w-sm bg-[var(--background)] rounded-lg shadow-lg p-8">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <h1
            className="text-32 text-bold mb-2"
            style={{ color: "var(--primary)" }}
          >
            we:connect
          </h1>
          <p className="text-14 text-[var(--grayLv3)]">팀과 함께 연결되세요</p>
        </div>

        {/* Nickname Login Form */}
        <form onSubmit={handleNicknameLogin} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="닉네임을 입력하세요 (예: Hati, Binky)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              disabled={isLoading}
            />
            {error && (
              <p className="text-12 text-[var(--error)] mt-2">* {error}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isLoading ? "로그인 중..." : "닉네임으로 로그인"}
          </Button>
        </form>

        {/* Quick Login */}
        <div className="mt-6">
          <p className="text-12 text-[var(--grayLv3)] mb-3 text-center">
            빠른 로그인
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {users.slice(0, 6).map((user) => (
              <button
                key={user.id}
                onClick={() => handleQuickLogin(user.displayName)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--grayLv1)] hover:bg-[var(--grayLv2)] transition-colors text-12 disabled:opacity-50"
              >
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.displayName}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <span className="w-5 h-5 rounded-full bg-slate-600 text-white text-10 flex items-center justify-center">
                    {user.displayName.charAt(0)}
                  </span>
                )}
                {user.displayName}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-[var(--grayLv2)]" />
          <span className="px-3 text-12 text-[var(--grayLv3)]">또는</span>
          <div className="flex-1 border-t border-[var(--grayLv2)]" />
        </div>

        {/* Discord Login */}
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white hover:bg-gray-700"
          onClick={handleDiscordLogin}
          disabled={isLoading}
        >
          <DiscordIcon className="h-5 w-5" />
          Discord로 로그인
        </Button>
      </div>
    </div>
  );
}

function DiscordIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}
