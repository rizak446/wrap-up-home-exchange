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
import { UserAvatar } from "@/components/ui/avatar";

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, creditAccount, logout } = useAuth();
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
    <header className="sticky top-0 z-40 w-full border-b border-[#E8DFD5] bg-[#FAF7F2]/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-11 w-11 rounded-2xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform bg-[#FBF8F3] border border-[#E8DFD5] p-0.5 flex items-center justify-center">
              <img
                src="/wrap-up-logo.jpg"
                alt="Wrap-Up Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight text-[#2E1E13] font-serif">
                  Wrap<span className="text-[#C8792C]">-Up</span>
                </span>
              </div>
              <span className="text-[11px] text-[#7A6F66] font-medium">Travel More • Spend Less</span>
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
                      ? "text-[#C8792C] bg-[#FAF5EA] font-bold shadow-xs border border-[#F4D9A0]/60"
                      : "text-[#5B4632] hover:text-[#C8792C] hover:bg-[#F4EFE9]"
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
              <Button variant="outline" size="sm" className="hidden lg:flex gap-1.5 border-[#C8792C] text-[#C8792C] hover:bg-[#FAF5EA]">
                <PlusCircle className="h-4 w-4" />
                Become a Host
              </Button>
            </Link>

            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* Credit Wallet Pill */}
                <Link
                  href="/dashboard/wallet"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FAF5EA] to-[#F6EBD1] border border-[#F4D9A0] text-[#745224] hover:shadow-sm transition-all text-xs font-bold"
                >
                  <Coins className="h-4 w-4 text-[#C8792C]" />
                  <span>{creditAccount?.available_balance ?? 0} pts</span>
                </Link>

                {/* My Trips Direct Access */}
                <Link
                  href="/dashboard/trips"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF5EA] hover:bg-[#F4EFE9] border border-[#E8DFD5] hover:border-[#F4D9A0] text-[#5B4632] hover:text-[#C8792C] transition-all text-xs font-bold active:scale-95"
                  title="View your booked stays and reservations"
                >
                  <Compass className="h-4 w-4 text-[#C8792C]" />
                  <span>My Trips</span>
                </Link>

                {/* Notifications Link */}
                <Link
                  href="/dashboard/notifications"
                  className="p-2 rounded-xl text-[#7A6F66] hover:text-[#2E1E13] hover:bg-[#F4EFE9] transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#C8792C]"></span>
                </Link>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-[#CEBCAB] hover:border-[#C8792C] transition-all bg-white cursor-pointer"
                  >
                    <span className="text-xs font-bold text-[#362719]">
                      {currentUser.full_name?.split(" ")[0] || "Member"}
                    </span>
                    <UserAvatar
                      src={currentUser.avatar_url}
                      name={currentUser.full_name}
                      size="sm"
                      className="h-8 w-8 ring-2 ring-[#C8792C]"
                    />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#FFFDF9] p-2 shadow-2xl border border-[#E8DFD5] z-50 text-xs">
                      {/* User Summary Header */}
                      <div className="px-3 py-2.5 border-b border-[#E8DFD5] mb-1 bg-[#FAF5EA] rounded-xl">
                        <p className="font-bold text-[#2E1E13] truncate text-sm">
                          {currentUser.full_name}
                        </p>
                        <p className="text-[11px] text-[#7A6F66] truncate">
                          {currentUser.email}
                        </p>
                        <div className="mt-1 flex items-center justify-between text-[11px]">
                          <span className="text-[#C8792C] font-semibold flex items-center gap-1">
                            <ShieldCheck className="h-3.5 w-3.5 text-[#C8792C]" />
                            {currentUser.identity_verified
                              ? "Verified Member"
                              : "Member"}
                          </span>
                          <span className="text-[#A8927D]">
                            {currentUser.city || "India"}
                          </span>
                        </div>
                      </div>

                      {/* Primary Profile Action */}
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#745224] bg-[#FAF5EA] hover:bg-[#F6EBD1] font-bold transition-colors mb-1"
                      >
                        <User className="h-4 w-4 text-[#C8792C]" />
                        <span>My Profile & Photo</span>
                      </Link>

                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#5B4632] hover:bg-[#F4EFE9]"
                      >
                        <Home className="h-4 w-4 text-[#7A6F66]" />
                        <span>Dashboard Overview</span>
                      </Link>

                      <Link
                        href="/dashboard/hosting"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#5B4632] hover:bg-[#F4EFE9]"
                      >
                        <Calendar className="h-4 w-4 text-[#7A6F66]" />
                        <span>Hosting Reservations</span>
                      </Link>

                      <Link
                        href="/dashboard/trips"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#5B4632] hover:bg-[#F4EFE9]"
                      >
                        <Compass className="h-4 w-4 text-[#7A6F66]" />
                        <span>My Trips</span>
                      </Link>

                      <Link
                        href="/dashboard/wallet"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#5B4632] hover:bg-[#F4EFE9]"
                      >
                        <Coins className="h-4 w-4 text-[#7A6F66]" />
                        <span>Credit Wallet</span>
                      </Link>

                      {currentUser.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-rose-700 bg-rose-50/50 hover:bg-rose-50 font-bold my-1"
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
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-left border-t border-[#E8DFD5] mt-1 cursor-pointer"
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
                  <Button variant="ghost" size="sm" className="text-[#5B4632] hover:bg-[#F4EFE9]">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="sm">
                    Sign Up
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
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF5EA] border border-[#F4D9A0] text-[#745224] text-xs font-bold"
              >
                <Coins className="h-3.5 w-3.5 text-[#C8792C]" />
                <span>{creditAccount?.available_balance ?? 0}</span>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#5B4632] hover:bg-[#F4EFE9]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E8DFD5] bg-[#FAF7F2] px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-base font-semibold text-[#5B4632] hover:bg-[#F4EFE9] hover:text-[#C8792C]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/dashboard/add-home"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-base font-semibold text-[#C8792C] hover:bg-[#FAF5EA]"
            >
              Become a Host
            </Link>
          </nav>

          <div className="border-t border-[#E8DFD5] pt-3">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-[#FAF5EA] border border-[#F4D9A0]/50 rounded-xl">
                  <UserAvatar
                    src={currentUser.avatar_url}
                    name={currentUser.full_name}
                    size="md"
                    className="h-10 w-10 ring-2 ring-[#C8792C]"
                  />
                  <div>
                    <div className="font-bold text-[#2E1E13]">{currentUser.full_name}</div>
                    <div className="text-xs text-[#C8792C] font-semibold">{creditAccount?.available_balance ?? 0} credits</div>
                  </div>
                </div>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#745224] bg-[#FAF5EA] font-bold"
                >
                  <User className="h-4 w-4 text-[#C8792C]" />
                  <span>My Profile & Photo</span>
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-[#5B4632] font-medium hover:bg-[#F4EFE9]"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/hosting"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-[#5B4632] font-medium hover:bg-[#F4EFE9]"
                >
                  Hosting Reservations
                </Link>
                <Link
                  href="/dashboard/trips"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-[#5B4632] font-medium hover:bg-[#F4EFE9]"
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
                    Sign Up
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
