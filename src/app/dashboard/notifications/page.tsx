"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Check, ExternalLink, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotificationItem } from "@/types";

export default function NotificationsPage() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      if (!currentUser) return;
      try {
        const res = await fetch(`/api/credits?userId=${currentUser.id}`);
        // We can load notifications directly from mock db via notifications endpoint or initial
        const notifsRes = await fetch(`/api/messages?userId=${currentUser.id}`);
        // Fallback or demo initial notifications:
        setNotifications([
          {
            id: "n-1",
            user_id: currentUser.id,
            title: "Welcome to HavenSwap! 🌟",
            message: "Your identity verification is approved and 150 welcome credits have been credited to your wallet.",
            category: "credit_update",
            link_url: "/dashboard/wallet",
            is_read: false,
            created_at: new Date().toISOString(),
          },
          {
            id: "n-2",
            user_id: currentUser.id,
            title: "Stay Request Update",
            message: "You can track and manage all exchange requests directly from your Hosting dashboard.",
            category: "system",
            link_url: "/dashboard/hosting",
            is_read: true,
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
        ]);
      } catch (e) {
        console.error("Error loading notifications", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadNotifications();
  }, [currentUser]);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-950 font-serif">Notifications</h1>
          <p className="text-xs text-slate-500">Stay updates, escrow alerts, and verification notices.</p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllRead}>
          <Check className="h-3.5 w-3.5 mr-1" />
          Mark All as Read
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
              n.is_read
                ? "bg-white border-slate-200/80 shadow-subtle"
                : "bg-teal-50/50 border-teal-200 shadow-sm"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl mt-0.5 ${n.is_read ? "bg-slate-100 text-slate-500" : "bg-teal-600 text-white"}`}>
                <Bell className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs text-navy-950">{n.title}</h4>
                  {!n.is_read && (
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-slate-400 block pt-1">
                  {new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>

            {n.link_url && (
              <Link href={n.link_url}>
                <Button variant="ghost" size="sm" className="text-teal-700 text-xs">
                  View <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
