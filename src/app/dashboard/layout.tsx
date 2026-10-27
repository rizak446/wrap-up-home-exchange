"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  PlusCircle,
  Compass,
  CalendarCheck,
  Coins,
  MessageSquare,
  ShieldCheck,
  Bell,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserAvatar } from "@/components/ui/avatar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, creditAccount, logout } = useAuth();

  const links = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Profile & Photo", href: "/dashboard/profile", icon: User },
    { label: "My Homes", href: "/dashboard/my-homes", icon: Home },
    { label: "Add a Home", href: "/dashboard/add-home", icon: PlusCircle },
    { label: "Hosting Requests", href: "/dashboard/hosting", icon: CalendarCheck },
    { label: "My Trips", href: "/dashboard/trips", icon: Compass },
    { label: "Credit Wallet", href: "/dashboard/wallet", icon: Coins },
    { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { label: "Verification", href: "/dashboard/verification", icon: ShieldCheck },
    { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 flex">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/80 p-4 sticky top-20 h-[calc(100vh-5rem)]">
        {/* User Card */}
        <Link
          href="/dashboard/profile"
          className="p-3.5 rounded-2xl bg-slate-50 hover:bg-teal-50/40 border border-slate-200/70 hover:border-teal-300 transition-all mb-4 flex items-center gap-3 group cursor-pointer"
          title="Click to view & edit your profile"
        >
          <div className="relative">
            <UserAvatar
              src={currentUser?.avatar_url}
              name={currentUser?.full_name}
              size="md"
              className="ring-2 ring-teal-500 group-hover:scale-105 transition-transform"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-teal-600 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white">
              ✎
            </span>
          </div>
          <div className="overflow-hidden flex-1">
            <h4 className="font-bold text-xs text-navy-950 truncate group-hover:text-teal-800 transition-colors">
              {currentUser?.full_name || "Member"}
            </h4>
            <div className="text-[11px] text-teal-700 font-bold flex items-center gap-1">
              <Coins className="h-3 w-3 text-teal-600" />
              <span>{creditAccount?.available_balance ?? 350} pts</span>
            </div>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-teal-50 text-teal-800 font-bold border border-teal-200/60"
                    : "text-slate-600 hover:text-navy-950 hover:bg-slate-100"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-teal-600" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 space-y-1">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Dashboard Workspace */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
