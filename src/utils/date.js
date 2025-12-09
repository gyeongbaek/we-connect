/**
 * 로컬 시간 기준 날짜 문자열 반환 (YYYY-MM-DD)
 * toISOString()은 UTC 기준이라 한국 시간에서 오전 9시 이전에는 하루 전 날짜가 나옴
 * @param {Date} date - Date 객체 (기본값: 현재 시간)
 * @returns {string} YYYY-MM-DD 형식의 날짜 문자열
 */
export function formatDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 오늘 날짜 문자열 반환 (YYYY-MM-DD)
 * @returns {string} YYYY-MM-DD 형식의 오늘 날짜
 */
export function getTodayString() {
  return formatDateString(new Date());
}
