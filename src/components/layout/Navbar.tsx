"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShieldCheck,
  Compass,
  Coins,
  Menu,
  X,
  User,
  PlusCircle,
  Calendar,
  LogOut,
  Bell,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, creditAccount, logout, loginAs } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const navLinks = [
    { label: "Explore Homes", href: "/homes" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Membership", href: "/membership" },
    { label: "Safety & Trust", href: "/safety" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-navy-950 via-slate-900 to-teal-800 flex items-center justify-center text-white shadow-md shadow-navy-950/20 group-hover:scale-105 transition-transform">
              <Compass className="h-6 w-6 text-teal-400" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight text-navy-950 font-serif">
                  Haven<span className="text-teal-600">Swap</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  Club
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Curated Home Exchange</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-teal-700 bg-teal-50/70"
                      : "text-slate-600 hover:text-navy-950 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* Add Home CTA */}
            <Link href="/dashboard/add-home">
              <Button variant="outline" size="sm" className="hidden lg:flex gap-1.5 border-teal-600 text-teal-700 hover:bg-teal-50">
                <PlusCircle className="h-4 w-4" />
                Become a Host
              </Button>
            </Link>

            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1.5 transition-colors"
                title="Switch persona for demonstration"
              >
                <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
                <span>Persona: <strong className="text-navy-950">{currentUser?.full_name?.split(" ")[0]}</strong></span>
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white p-2 shadow-xl border border-slate-200 z-50 text-xs">
                  <div className="px-2 py-1.5 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Switch Demo Persona
                  </div>
                  <button
                    onClick={() => { loginAs("user-traveler-arjun"); setRoleSwitcherOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 flex flex-col gap-0.5"
                  >
                    <span className="font-bold text-slate-900">Arjun Verma (Bhopal)</span>
                    <span className="text-[11px] text-teal-600">Traveler with 350 pts booking Goa</span>
                  </button>
                  <button
                    onClick={() => { loginAs("user-goa-alisha"); setRoleSwitcherOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 flex flex-col gap-0.5"
                  >
                    <span className="font-bold text-slate-900">Alisha Fernandes (Goa)</span>
                    <span className="text-[11px] text-teal-600">Host of Candolim Beach Villa</span>
                  </button>
                  <button
                    onClick={() => { loginAs("user-bhopal-rajesh"); setRoleSwitcherOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 flex flex-col gap-0.5"
                  >
                    <span className="font-bold text-slate-900">Rajesh Sharma (Bhopal)</span>
                    <span className="text-[11px] text-teal-600">Host of Upper Lake Villa</span>
                  </button>
                  <button
                    onClick={() => { loginAs("user-admin-sarah"); setRoleSwitcherOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 flex flex-col gap-0.5 border-t border-slate-100"
                  >
                    <span className="font-bold text-rose-700">Sarah Matthews (Admin)</span>
                    <span className="text-[11px] text-slate-500">Platform Moderation & Security</span>
                  </button>
                </div>
              )}
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* Credit Wallet Pill */}
                <Link
                  href="/dashboard/wallet"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 text-teal-900 hover:shadow-sm transition-all text-xs font-bold"
                >
                  <Coins className="h-4 w-4 text-teal-600" />
                  <span>{creditAccount ? creditAccount.available_balance : 350} pts</span>
                </Link>

                {/* Notifications Link */}
                <Link
                  href="/dashboard/notifications"
                  className="p-2 rounded-xl text-slate-500 hover:text-navy-950 hover:bg-slate-100 transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500"></span>
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-slate-300 hover:border-slate-400 transition-all bg-white"
                  >
                    <span className="text-xs font-bold text-slate-800">{currentUser.full_name.split(" ")[0]}</span>
                    <img
                      src={currentUser.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                      alt={currentUser.full_name}
                      className="h-7 w-7 rounded-full object-cover ring-1 ring-teal-500"
                    />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl border border-slate-200 z-50 text-sm">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="font-bold text-navy-950 truncate">{currentUser.full_name}</p>
                        <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                        {currentUser.identity_verified && (
                          <div className="mt-1 flex items-center gap-1 text-[11px] text-teal-600 font-semibold">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Verified Member</span>
                          </div>
                        )}
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50"
                      >
                        <Home className="h-4 w-4 text-slate-500" />
                        <span>Dashboard Overview</span>
                      </Link>

                      <Link
                        href="/dashboard/hosting"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50"
                      >
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span>Hosting Reservations</span>
                      </Link>

                      <Link
                        href="/dashboard/trips"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50"
                      >
                        <Compass className="h-4 w-4 text-slate-500" />
                        <span>My Trips</span>
                      </Link>

                      <Link
                        href="/dashboard/wallet"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50"
                      >
                        <Coins className="h-4 w-4 text-slate-500" />
                        <span>Credit Wallet</span>
                      </Link>

                      <Link
                        href="/dashboard/verification"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50"
                      >
                        <ShieldCheck className="h-4 w-4 text-slate-500" />
                        <span>Verification Center</span>
                      </Link>

                      {currentUser.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-rose-700 bg-rose-50/50 hover:bg-rose-50 font-bold border-t border-slate-100 my-1"
                        >
                          <Lock className="h-4 w-4" />
                          <span>Admin Portal</span>
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-left border-t border-slate-100 mt-1"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="sm">
                    Join Club
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {currentUser && (
              <Link
                href="/dashboard/wallet"
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold"
              >
                <Coins className="h-3.5 w-3.5 text-teal-600" />
                <span>{creditAccount?.available_balance || 350}</span>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/dashboard/add-home"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-base font-semibold text-teal-700 hover:bg-teal-50"
            >
              Become a Host
            </Link>
          </nav>

          <div className="border-t border-slate-100 pt-3">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl">
                  <img
                    src={currentUser.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-navy-950">{currentUser.full_name}</div>
                    <div className="text-xs text-teal-600 font-semibold">{creditAccount?.available_balance || 350} credits</div>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-slate-700 font-medium hover:bg-slate-50"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/hosting"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-slate-700 font-medium hover:bg-slate-50"
                >
                  Hosting Reservations
                </Link>
                <Link
                  href="/dashboard/trips"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-slate-700 font-medium hover:bg-slate-50"
                >
                  My Trips
                </Link>
                {currentUser.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-rose-700 font-bold bg-rose-50"
                  >
                    Admin Portal
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-rose-600 font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Join Club
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
