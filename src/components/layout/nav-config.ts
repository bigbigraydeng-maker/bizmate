import {
  Calculator,
  Calendar,
  MessageSquare,
  Plane,
  Settings,
  Stethoscope,
} from "lucide-react";

export const dashboardNav = [
  { href: "/chat", messageKey: "chat", Icon: MessageSquare },
  { href: "/calculators", messageKey: "calculators", Icon: Calculator },
  { href: "/calendar", messageKey: "calendar", Icon: Calendar },
  { href: "/gp", messageKey: "gp", Icon: Stethoscope },
  { href: "/flights", messageKey: "flights", Icon: Plane },
  { href: "/settings", messageKey: "settings", Icon: Settings },
] as const;

export type DashboardNavMessageKey = (typeof dashboardNav)[number]["messageKey"];
