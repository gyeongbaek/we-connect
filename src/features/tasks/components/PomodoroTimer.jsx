import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Settings, X } from "lucide-react";

// 기본 포모도로 설정 (분 단위)
const DEFAULT_SETTINGS = {
  workDuration: 25, // 작업 시간
  breakDuration: 5, // 짧은 휴식
  longBreakDuration: 15, // 긴 휴식
  sessionsBeforeLongBreak: 4, // 긴 휴식 전 세션 수
};

export function PomodoroTimer() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60); // 초 단위
  const [isBreak, setIsBreak] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);

  // 알림음 재생
  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleCAIN6Xc6LF7IAkwa9/rwXYeDAJV3e3JfyEIB0vd7sp/IQgHTN3uyoAhBwdN3u/KgCEHB03e78qAIQcHTd7vyoAhBwdN3u/K"
      );
      audio.volume = 0.3;
      audio.play();
    } catch {
      // 알림음 실패 무시
    }
  }, []);

  // 타이머 완료 처리 (useCallback으로 메모이제이션)
  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    playNotificationSound();

    setIsBreak((prevIsBreak) => {
      if (prevIsBreak) {
        // 휴식 완료 -> 작업 시작
        setTimeLeft(settings.workDuration * 60);
        return false;
      } else {
        // 작업 완료 -> 세션 증가 & 휴식 시작
        setCompletedSessions((prev) => {
          const newSessions = prev + 1;
          // 긴 휴식 vs 짧은 휴식
          if (newSessions % settings.sessionsBeforeLongBreak === 0) {
            setTimeLeft(settings.longBreakDuration * 60);
          } else {
            setTimeLeft(settings.breakDuration * 60);
          }
          return newSessions;
        });
        return true;
      }
    });
  }, [settings, playNotificationSound]);

  // 타이머 동작
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // 다음 틱에서 완료 처리
            setTimeout(handleTimerComplete, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, handleTimerComplete]);

  // 시작/일시정지
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // 리셋
  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(settings.workDuration * 60);
  };

  // 시간 포맷팅
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // 설정 변경
  const handleSettingsChange = (key, value) => {
    const numValue = parseInt(value) || 1;
    setSettings((prev) => ({ ...prev, [key]: numValue }));
  };

  // 설정 저장
  const saveSettings = () => {
    setShowSettings(false);
    if (!isRunning) {
      setTimeLeft(settings.workDuration * 60);
    }
  };

  // 진행률 계산
  const totalTime = isBreak
    ? (completedSessions % settings.sessionsBeforeLongBreak === 0
        ? settings.longBreakDuration
        : settings.breakDuration) * 60
    : settings.workDuration * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3 mb-4">
      <div className="flex items-center justify-between">
        {/* 타이머 표시 */}
        <div className="flex items-center gap-3">
          <span className="text-lg">🍅</span>

          {/* 시간 */}
          <div className="relative">
            <div
              className={`text-2xl font-mono font-bold ${
                isBreak ? "text-green-600" : "text-slate-800"
              }`}
            >
              {formatTime(timeLeft)}
            </div>
            {/* 진행 바 */}
            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  isBreak ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 상태 표시 */}
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              isBreak
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {isBreak ? "휴식" : "집중"}
          </span>
        </div>

        {/* 컨트롤 버튼 */}
        <div className="flex items-center gap-2">
          {/* 시작/일시정지 */}
          <button
            onClick={toggleTimer}
            className={`p-2 rounded-lg transition-colors ${
              isRunning
                ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
            }`}
          >
            {isRunning ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </button>

          {/* 리셋 */}
          <button
            onClick={resetTimer}
            className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* 완료한 세션 수 - 10개 초과 시 균등하게 2줄로 배치 */}
          <div className="flex flex-col gap-0.5 px-2 py-1 bg-slate-50 rounded-lg">
            {(() => {
              const total = settings.sessionsBeforeLongBreak;
              const needsTwoRows = total > 10;
              const firstRowCount = needsTwoRows ? Math.ceil(total / 2) : total;
              const secondRowCount = needsTwoRows ? total - firstRowCount : 0;

              return (
                <>
                  {/* 첫 번째 줄 */}
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: firstRowCount }).map((_, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < completedSessions ? "bg-red-500" : "bg-slate-200"
                        }`}
                      />
                    ))}
                    {!needsTwoRows && (
                      <span className="text-xs text-slate-500 ml-1">
                        {completedSessions}회
                      </span>
                    )}
                  </div>
                  {/* 두 번째 줄 (11개 이상일 때만) */}
                  {needsTwoRows && (
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: secondRowCount }).map((_, i) => (
                        <span
                          key={i + firstRowCount}
                          className={`w-2 h-2 rounded-full ${
                            i + firstRowCount < completedSessions
                              ? "bg-red-500"
                              : "bg-slate-200"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-slate-500 ml-1">
                        {completedSessions}회
                      </span>
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          {/* 설정 */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 설정 패널 */}
      {showSettings && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              타이머 설정
            </span>
            <button
              onClick={() => setShowSettings(false)}
              className="p-1 hover:bg-slate-100 rounded"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">
                작업 시간
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.workDuration}
                onChange={(e) =>
                  handleSettingsChange("workDuration", e.target.value)
                }
                className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">
                짧은 휴식
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.breakDuration}
                onChange={(e) =>
                  handleSettingsChange("breakDuration", e.target.value)
                }
                className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">
                긴 휴식
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.longBreakDuration}
                onChange={(e) =>
                  handleSettingsChange("longBreakDuration", e.target.value)
                }
                className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">
                세션 수
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={settings.sessionsBeforeLongBreak}
                onChange={(e) =>
                  handleSettingsChange(
                    "sessionsBeforeLongBreak",
                    e.target.value
                  )
                }
                className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
              />
            </div>
          </div>
          <button
            onClick={saveSettings}
            className="mt-2 w-full py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            설정 저장
          </button>
        </div>
      )}
    </div>
  );
}
