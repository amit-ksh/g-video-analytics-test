export const trackVideoEvent = (action, label) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: "Video",
      event_label: label,
    });
  }
};
