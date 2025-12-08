import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { VACATION_TYPES } from "../../../mock/attendanceData";

export function VacationStatus({ balances, onRequestVacation }) {
  const [selectedType, setSelectedType] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleCardClick = (type) => {
    setSelectedType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedType(null);
  };

  const handleSubmitVacation = (vacationData) => {
    onRequestVacation?.(vacationData);
    handleCloseModal();
  };

  const getStatusText = (balance) => {
    if (balance.remaining === 0) {
      return "소진";
    }
    if (balance.used === 0 && balance.total > 0) {
      return `신청가능(${balance.total}일)`;
    }
    return `${balance.remaining}/${balance.total}일`;
  };

  return (
    <div className="bg-[var(--background)] rounded-lg border border-[var(--grayLv2)] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-16 text-semibold">휴가 현황</h3>
      </div>

      {/* Vacation Cards Grid */}
      <div className="grid grid-cols-3 gap-2">
        {balances.map((balance) => {
          const typeInfo = VACATION_TYPES[balance.type];
          const isAvailable = balance.remaining > 0;

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

      {/* Vacation Request Modal */}
      {showModal && (
        <VacationRequestModal
          selectedType={selectedType}
          balances={balances}
          onClose={handleCloseModal}
          onSubmit={handleSubmitVacation}
        />
      )}
    </div>
  );
}

function VacationRequestModal({ selectedType, balances, onClose, onSubmit }) {
  const [type, setType] = useState(selectedType || "PAID");
  const [timeType, setTimeType] = useState("FULL"); // MORNING, AFTERNOON, FULL, CUSTOM
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const typeInfo = VACATION_TYPES[type];
  const balance = balances.find((b) => b.type === type);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      type,
      timeType,
      startDate,
      endDate,
      days: timeType === "FULL" ? 1 : 0.5,
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
            {balance && (
              <p className="text-10 text-[var(--grayLv3)] mt-1">
                잔여: {balance.remaining}일 / {balance.total}일
              </p>
            )}
          </div>

          {/* Time Type */}
          <div>
            <label className="text-12 text-[var(--grayLv3)] mb-1 block">
              휴가 시간
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "MORNING", label: "오전 휴가 (9-12)" },
                { value: "AFTERNOON", label: "오후 휴가 (13-18)" },
                { value: "FULL", label: "종일 휴가 (9-18)" },
                { value: "CUSTOM", label: "시간 지정" },
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
