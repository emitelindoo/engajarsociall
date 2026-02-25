// Meta Pixel helper — typed wrapper for fbq with Advanced Matching
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

/**
 * Set Advanced Matching user data to improve event quality score.
 * Call this whenever you have user info (e.g. after filling checkout form).
 */
export const fbSetUserData = (userData: {
  em?: string; // email
  fn?: string; // first name
  ln?: string; // last name
  ph?: string; // phone
  external_id?: string;
}) => {
  if (typeof window !== "undefined" && window.fbq) {
    // Re-init pixel with user data for advanced matching
    window.fbq("init", "785061701305440", userData);
  }
};
