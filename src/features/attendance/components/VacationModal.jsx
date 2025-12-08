import { X } from "lucide-react";
import { useVacationStore } from "../../../stores";
import { VACATION_TYPES, mockVacationBalance } from "../../../mock/attendanceData";

export const VacationModal = ({ onSelect }) => {
  const { isModalOpen, selectedPeriod, closeModal } = useVacationStore();

  if (!isModalOpen) return null;

  const availableVacations = mockVacationBalance.filter((b) => b.remaining > 0);

  const handleSelect = (vacationType) => {
    onSelect?.(selectedPeriod, vacationType);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-sm p-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">
            {selectedPeriod === "morning" ? "오전" : "오후"} 휴가 선택
          </h3>
          <button
            onClick={closeModal}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {availableVacations.length === 0 ? (
            <p className="text-center text-slate-500 py-4 text-sm">
              사용 가능한 휴가가 없습니다.
            </p>
          ) : (
            availableVacations.map((balance) => {
              const typeInfo = VACATION_TYPES[balance.type];
              return (
                <button
                  key={balance.type}
                  onClick={() => handleSelect(balance.type)}
                  className="w-full p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-left transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{typeInfo.emoji}</span>
                    <span className="text-sm font-medium text-slate-700">
                      {typeInfo.label}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {balance.remaining}일 남음
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
