import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Camera } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStripeOAuthLink(
  accountType: "agency" | "subaccount",
  state: string
) {
  return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${process.env.NEXT_PUBLIC_URL}${accountType}&state=${state}`;
}

const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];

export function connectionIdToColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length];
}

export function pointerEventToCanvasPoint(
  e: React.PointerEvent,
  camera: Camera
) {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  };
}

export function toSlug(text: string): string {
  // 1. Convert to lowercase
  return (
    text
      .toLowerCase()
      // 2. Remove non-alphanumeric characters except spaces, hyphens, and underscores
      .replace(/[^\w\s-]/g, "")
      // 3. Replace spaces with hyphens
      .replace(/\s+/g, "-")
      // 4. Remove leading or trailing hyphens
      .replace(/^-+|-+$/g, "")
  );
}
