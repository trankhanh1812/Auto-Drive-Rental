"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ownerService } from "@/lib/services/ownerService";
import Link from "next/link";
import {
  Car,
  Calendar,
  DollarSign,
  Clock,
  TrendingUp,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types";

export default function OwnerDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboard, setDashboard] = useState({
    totalCars: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    activeRentals: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/owner/dashboard");
      return;
    }

    if (user && user.role !== UserRole.OWNER) {
      router.push("/");
      return;
    }

    loadDashboard();
  }, [isAuthenticated, user]);

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await ownerService.getDashboard();
      setDashboard(data);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError("Bạn không có quyền truy cập. Chỉ chủ xe mới được phép.");
        setTimeout(() => router.push("/"), 2000);
      } else {
        setError(err.response?.data?.message || "Không thể tải dữ liệu");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg max-w-md">
          <p className="font-semibold mb-2">Lỗi</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Chủ Xe
          </h1>
          <p className="text-gray-600 mt-2">
            Xin chào, {user?.fullName}! Quản lý xe và đơn đặt xe của bạn
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Tổng số xe</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboard.totalCars}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Car className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <Link href="/owner/cars" className="text-blue-600 text-sm mt-3 inline-block hover:underline">
              Xem chi tiết →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Tổng đơn đặt</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboard.totalBookings}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <Link href="/owner/bookings" className="text-green-600 text-sm mt-3 inline-block hover:underline">
              Xem tất cả →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Doanh thu</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {dashboard.totalRevenue.toLocaleString("vi-VN")}đ
                </p>
                <p className="text-xs text-gray-500 mt-1">Từ đơn hoàn thành</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Đơn chờ duyệt</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {dashboard.pendingBookings}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Đang thuê: {dashboard.activeRentals}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <Link href="/owner/bookings" className="text-orange-600 text-sm mt-3 inline-block hover:underline">
              Xử lý ngay →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/owner/cars/new"
              className="flex items-center gap-3 p-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition"
            >
              <Plus className="w-6 h-6" />
              <div className="text-left">
                <p className="font-semibold">Thêm xe mới</p>
                <p className="text-sm text-gray-600">
                  Đăng xe cho thuê của bạn
                </p>
              </div>
            </Link>

            <Link
              href="/owner/cars"
              className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <Car className="w-6 h-6 text-gray-600" />
              <div className="text-left">
                <p className="font-semibold">Quản lý xe</p>
                <p className="text-sm text-gray-600">
                  Xem và chỉnh sửa xe của bạn
                </p>
              </div>
            </Link>

            <Link
              href="/owner/bookings"
              className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <Calendar className="w-6 h-6 text-gray-600" />
              <div className="text-left">
                <p className="font-semibold">Quản lý đơn đặt</p>
                <p className="text-sm text-gray-600">
                  Xem và duyệt đơn đặt xe
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Hoạt động gần đây</h2>
          <div className="text-center py-8 text-gray-500">
            <p>Chưa có hoạt động nào</p>
            <p className="text-sm mt-2">
              Thêm xe mới để bắt đầu nhận đơn đặt
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
