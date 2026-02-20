// Meta Pixel helper — typed wrapper for fbq
declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

export const fbEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, params);
  }
};
