// Meta Pixel helper — browser Pixel + Conversions API (server-side) with deduplication
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

export const PIXEL_ID = "1974107703363237";

type UserData = {
  em?: string;
  fn?: string;
  ln?: string;
  ph?: string;
  external_id?: string;
};

let currentUserData: UserData = {};

const getCookie = (name: string) => {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${name}=`))
    ?.split("=")[1];
};

const newEventId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

/**
 * Fires the event in the browser Pixel AND forwards it to the Meta
 * Conversions API with the same event_id so Meta deduplicates them.
 */
export const fbEvent = (eventName: string, params?: Record<string, any>) => {
  const eventId = newEventId();

  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, params ?? {}, { eventID: eventId });
  }

  // Server-side copy (improves attribution / ad optimization)
  void supabase.functions
    .invoke("meta-capi", {
      body: {
        event_name: eventName,
        event_id: eventId,
        event_source_url:
          typeof window !== "undefined" ? window.location.href : undefined,
        custom_data: params ?? {},
        user_data: {
          email: currentUserData.em,
          first_name: currentUserData.fn,
          last_name: currentUserData.ln,
          phone: currentUserData.ph,
          external_id: currentUserData.external_id,
          fbp: getCookie("_fbp"),
          fbc: getCookie("_fbc"),
        },
      },
    })
    .catch(() => {
      /* tracking must never break the UI */
    });

  return eventId;
};

/**
 * Set Advanced Matching user data to improve event quality score.
 * Call this whenever you have user info (e.g. after filling checkout form).
 */
export const fbSetUserData = (userData: UserData) => {
  currentUserData = { ...currentUserData, ...userData };
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("init", PIXEL_ID, userData);
  }
};
