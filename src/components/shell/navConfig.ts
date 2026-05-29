import {
  Bookmark,
  Building2,
  FilePlus2,
  Flag,
  Inbox,
  LayoutDashboard,
  type LucideIcon,
  Search,
  Send,
  Shield,
  Star,
  UserCircle2,
  Users,
} from "lucide-react";
import type { Role } from "@/types/domain";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const APP_NAV_BY_ROLE: Record<Role, NavItem[]> = {
  RENTER: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/listings", label: "Browse", icon: Search },
    { href: "/saved-listings", label: "Saved", icon: Bookmark },
    { href: "/inquiries/sent", label: "Sent inquiries", icon: Send },
    { href: "/profile", label: "Profile", icon: UserCircle2 },
  ],
  AGENT: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/listings", label: "Marketplace", icon: Search },
    { href: "/my-listings", label: "My listings", icon: Building2 },
    { href: "/my-listings/new", label: "New listing", icon: FilePlus2 },
    { href: "/inquiries/received", label: "Inbox", icon: Inbox },
    { href: "/profile", label: "Profile", icon: UserCircle2 },
  ],
  LANDLORD: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/listings", label: "Marketplace", icon: Search },
    { href: "/my-listings", label: "My listings", icon: Building2 },
    { href: "/my-listings/new", label: "New listing", icon: FilePlus2 },
    { href: "/inquiries/received", label: "Inbox", icon: Inbox },
    { href: "/profile", label: "Profile", icon: UserCircle2 },
  ],
  ADMIN: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/listings", label: "Marketplace", icon: Search },
    { href: "/profile", label: "Profile", icon: UserCircle2 },
  ],
};

export const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: Shield },
  { href: "/admin/listings", label: "Listings", icon: Building2 },
  { href: "/admin/recommendations", label: "Recommendations", icon: Star },
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/users", label: "Users", icon: Users },
];
