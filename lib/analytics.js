export const trackVideoEvent = (action, label) => {
  try {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", action, {
        event_category: "Video",
        event_label: label,
      });
    } else {
      console.warn("Google Analytics not initialized or gtag not found.");
    }
  } catch (error) {
    console.error("Error tracking video event:", error);
  }
};
