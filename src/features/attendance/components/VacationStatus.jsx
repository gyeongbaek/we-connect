import { useState, useEffect } from "react";
import { X, Trash2, Clock } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { VACATION_TYPES } from "../../../mock/attendanceData";
import { useVacationStore } from "../../../stores";

export function VacationStatus({ balances }) {
  const [selectedType, setSelectedType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);

  const {
    registerVacation,
    getVacationsForMonth,
    getVacationForDate,
    removeVacation,
    getUsedVacationHours,
  } = useVacationStore();

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // 오늘 등록된 휴가 정보
  const todayVacation = getVacationForDate(todayStr);

  // 남은 시간 계산 (오늘 휴가인 경우)
  useEffect(() => {
    if (!todayVacation) {
      setRemainingTime(null);
      return;
    }

    const calculateRemainingTime = () => {
      const now = new Date();
      let endHour, endMinute;

      // 휴가 종료 시간 설정
      if (todayVacation.timeType === "MORNING") {
        endHour = 12;
        endMinute = 0;
      } else if (todayVacation.timeType === "AFTERNOON") {
        endHour = 18;
        endMinute = 0;
      } else {
        // FULL
        endHour = 18;
        endMinute = 0;
      }

      const endTime = new Date();
      endTime.setHours(endHour, endMinute, 0, 0);

      const diff = endTime - now;
      if (diff <= 0) {
        return null;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return { hours, minutes };
    };

    const updateTime = () => {
      setRemainingTime(calculateRemainingTime());
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // 1분마다 업데이트

    return () => clearInterval(interval);
  }, [todayVacation]);

  // 이번 달 등록된 휴가 목록
  const monthVacations = getVacationsForMonth(currentYear, currentMonth);

  const handleCardClick = (type) => {
    setSelectedType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedType(null);
  };

  const handleSubmitVacation = (vacationData) => {
    registerVacation(vacationData);
    handleCloseModal();
  };

  const handleRemoveVacation = (date) => {
    removeVacation(date);
  };

  // 휴가 시간 기반 잔여 계산 (8시간 = 1일)
  const getVacationHoursInfo = (balance) => {
    const usedHours = getUsedVacationHours(balance.type);
    const totalHours = balance.total * 8;
    const remainingHours = totalHours - usedHours;

    return {
      usedHours,
      totalHours,
      remainingHours,
      usedDays: usedHours / 8,
      remainingDays: remainingHours / 8,
    };
  };

  const getStatusText = (balance) => {
    const info = getVacationHoursInfo(balance);

    if (info.remainingHours <= 0) {
      return "소진";
    }
    if (info.usedHours === 0 && info.totalHours > 0) {
      return `${info.totalHours}시간`;
    }
    return `${info.remainingHours}/${info.totalHours}시간`;
  };

  const formatTimeType = (timeType) => {
    switch (timeType) {
      case "MORNING":
        return "오전";
      case "AFTERNOON":
        return "오후";
      case "FULL":
        return "종일";
      default:
        return timeType;
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 이번 달 사용한 총 휴가 시간
  const monthlyUsedHours = monthVacations.reduce(
    (sum, v) => sum + (v.timeType === "FULL" ? 8 : 4),
    0
  );

  return (
    <div className="bg-[var(--background)] rounded-lg border border-[var(--grayLv2)] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-16 text-semibold">휴가 현황</h3>
        <span className="text-xs text-slate-400">1일 = 8시간</span>
      </div>

      {/* 오늘 휴가 정보 - 남은 시간 표시 */}
      {todayVacation && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {VACATION_TYPES[todayVacation.vacationType]?.emoji || "🌴"}
              </span>
              <div>
                <p className="text-sm font-medium text-orange-700">
                  {VACATION_TYPES[todayVacation.vacationType]?.label || "휴가"}
                  <span className="ml-1 text-xs text-orange-500">
                    ({todayVacation.timeType === "FULL"
                      ? "종일"
                      : todayVacation.timeType === "MORNING"
                      ? "오전"
                      : "오후"})
                  </span>
                </p>
                {remainingTime && (
                  <p className="text-xs text-orange-600 flex items-center gap-1 mt-0.5">
                    <Clock size={10} />
                    남은 시간: {remainingTime.hours}시간 {remainingTime.minutes}분
                  </p>
                )}
                {!remainingTime && (
                  <p className="text-xs text-orange-500 mt-0.5">휴가 종료</p>
                )}
              </div>
            </div>
            <button
              onClick={() => removeVacation(todayStr)}
              className="p-1.5 hover:bg-orange-100 rounded text-orange-400 hover:text-red-500"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Vacation Cards Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {balances.map((balance) => {
          const typeInfo = VACATION_TYPES[balance.type];
          const hoursInfo = getVacationHoursInfo(balance);
          const isAvailable = hoursInfo.remainingHours > 0;

          return (
            <button
              key={balance.type}
              onClick={() => isAvailable && handleCardClick(balance.type)}
              disabled={!isAvailable}
              className={`p-3 rounded-lg border text-left transition-colors ${
                isAvailable
                  ? "border-[var(--grayLv2)] hover:border-[var(--primary)] hover:bg-[var(--activation)] cursor-pointer"
                  : "border-[var(--grayLv1)] bg-[var(--grayLv1)] opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="text-16 mb-1">{typeInfo.emoji}</div>
              <div className="text-12 text-semibold truncate">
                {typeInfo.label}
              </div>
              <div
                className={`text-10 ${
                  isAvailable ? "text-[var(--grayLv3)]" : "text-[var(--error)]"
                }`}
              >
                {getStatusText(balance)}
              </div>
            </button>
          );
        })}
      </div>

      {/* 12월 사용 휴가 */}
      <div className="border-t border-slate-100 pt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-700 font-semibold">
            {currentMonth + 1}월 사용 휴가
          </span>
          <span className={`text-xs font-medium ${monthlyUsedHours > 0 ? "text-blue-600" : "text-slate-400"}`}>
            {monthlyUsedHours > 0 ? `${monthlyUsedHours}시간 (${monthlyUsedHours / 8}일)` : "없음"}
          </span>
        </div>
        {monthVacations.length > 0 ? (
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {monthVacations.map((vacation) => {
              const typeInfo = VACATION_TYPES[vacation.vacationType];
              return (
                <div
                  key={vacation.date}
                  className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span>{typeInfo?.emoji}</span>
                    <span className="font-medium text-slate-700">
                      {formatDate(vacation.date)}
                    </span>
                    <span className="text-slate-400">
                      {formatTimeType(vacation.timeType)}
                    </span>
                    <span className="text-blue-500">
                      {vacation.timeType === "FULL" ? "8시간" : "4시간"}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveVacation(vacation.date)}
                    className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-red-500"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-2">
            등록된 휴가가 없습니다
          </p>
        )}
      </div>

      {/* Vacation Request Modal */}
      {showModal && (
        <VacationRequestModal
          selectedType={selectedType}
          balances={balances}
          getVacationHoursInfo={getVacationHoursInfo}
          onClose={handleCloseModal}
          onSubmit={handleSubmitVacation}
        />
      )}
    </div>
  );
}

function VacationRequestModal({
  selectedType,
  balances,
  getVacationHoursInfo,
  onClose,
  onSubmit,
}) {
  const [type, setType] = useState(selectedType || "PAID");
  const [timeType, setTimeType] = useState("FULL");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const balance = balances.find((b) => b.type === type);
  const hoursInfo = balance ? getVacationHoursInfo(balance) : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      type,
      timeType,
      startDate,
      endDate,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--background)] rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-18 text-semibold">휴가 신청</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vacation Type */}
          <div>
            <label className="text-12 text-[var(--grayLv3)] mb-1 block">
              휴가 종류
            </label>
            <select
              className="w-full h-10 rounded-md border border-[var(--grayLv2)] px-3 text-14"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {Object.entries(VACATION_TYPES).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.emoji} {info.label}
                </option>
              ))}
            </select>
            {hoursInfo && (
              <p className="text-10 text-[var(--grayLv3)] mt-1">
                잔여: {hoursInfo.remainingHours}시간 / {hoursInfo.totalHours}
                시간 ({hoursInfo.remainingDays}일)
              </p>
            )}
          </div>

          {/* Time Type */}
          <div>
            <label className="text-12 text-[var(--grayLv3)] mb-1 block">
              휴가 시간
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "MORNING", label: "오전 (4시간)" },
                { value: "AFTERNOON", label: "오후 (4시간)" },
                { value: "FULL", label: "종일 (8시간)" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTimeType(option.value)}
                  className={`p-2 text-12 rounded border ${
                    timeType === option.value
                      ? "border-[var(--primary)] bg-[var(--activation)] text-[var(--primary)]"
                      : "border-[var(--grayLv2)]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-12 text-[var(--grayLv3)] mb-1 block">
                시작일
              </label>
              <input
                type="date"
                className="w-full h-10 rounded-md border border-[var(--grayLv2)] px-3 text-14"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-12 text-[var(--grayLv3)] mb-1 block">
                종료일
              </label>
              <input
                type="date"
                className="w-full h-10 rounded-md border border-[var(--grayLv2)] px-3 text-14"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              취소
            </Button>
            <Button type="submit" className="flex-1">
              신청하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
