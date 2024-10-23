export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || "";

// 페이지뷰를 기록하는 함수
export const pageView = (url: string) => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

// 이벤트를 기록하는 함수
export const event = (
  action: string,
  {
    event_category,
    event_label,
    value,
  }: { event_category: string; event_label: string; value: number }
) => {
  if (process.env.NODE_ENV === "development") return;
  window.gtag("event", action, {
    event_category,
    event_label,
    value,
  });
};
