"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Car, User, LogOut, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { UserRole } from "@/types";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white sticky top-0 z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <nav className="container mx-auto px-4 py-4"> */}
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold hover:scale-105 transition-transform"
          >
            <Car className="w-8 h-8" />
            <span>AutoDrive</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="hover:text-blue-200 transition-colors font-medium"
            >
              Trang chủ
            </Link>
            <Link
              href="/cars"
              className="hover:text-blue-200 transition-colors font-medium"
            >
              Xe cho thuê
            </Link>
            <Link
              href="/about"
              className="hover:text-blue-200 transition-colors font-medium"
            >
              Về chúng tôi
            </Link>
            <Link href="/contact" className="hover:text-purple-200 transition">
              Liên hệ
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!mounted ? (
              // Placeholder during SSR to avoid hydration mismatch
              <div className="flex items-center space-x-4">
                <div className="w-20 h-8 bg-white/20 rounded animate-pulse"></div>
                <div className="w-20 h-8 bg-white/20 rounded animate-pulse"></div>
              </div>
            ) : isAuthenticated ? (
              <>
                <Link
                  href="/bookings"
                  className="hover:text-purple-200 transition"
                >
                  Đơn đặt xe
                </Link>
                {user?.role === UserRole.ADMIN && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-1 bg-yellow-500 text-gray-900 px-3 py-1.5 rounded-lg font-semibold hover:bg-yellow-400 transition"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                {user?.role === UserRole.OWNER && (
                  <Link
                    href="/owner/dashboard"
                    className="flex items-center gap-1 hover:text-purple-200 transition"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 hover:text-purple-200 transition"
                >
                  <User className="w-5 h-5" />
                  <span>{user?.fullName}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 hover:text-purple-200 transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Đăng xuất</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hover:text-purple-200 transition"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
