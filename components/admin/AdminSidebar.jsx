"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  User,
  FolderKanban,
  Mail,
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  BookOpen,
  Wrench,
  Blocks,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Profile", href: "/admin/profile", icon: User },
  { name: "Experience", href: "/admin/experience", icon: Briefcase },
  { name: "Education", href: "/admin/education", icon: GraduationCap },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Skills", href: "/admin/skills", icon: Wrench },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Services", href: "/admin/services", icon: Blocks },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile topbar */}
      <div className="lg:hidden relative flex items-center p-4 border-b border-white/10">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-md border border-white/10 hover:bg-white/10 transition"
        >
          <Menu size={22} />
        </button>

        <h2 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
          Admin Panel
        </h2>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-72 lg:min-h-screen lg:flex-col lg:justify-between border-r border-white/10 bg-[#1a1a24] p-6">
        <div>
          <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

          <nav className="space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition"
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          <span className="text-sm text-white/60">Admin Account</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-[#1a1a24] border-r border-white/10 p-6 transform transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-md border border-white/10 hover:bg-white/10 transition"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition"
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 mt-8 border-t border-white/10 flex items-center justify-between">
          <span className="text-sm text-white/60">Admin Account</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </aside>
    </>
  );
}
