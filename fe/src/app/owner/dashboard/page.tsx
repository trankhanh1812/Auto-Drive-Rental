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
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { UserRole, Car as CarType } from "@/types";

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
  const [rejectedCars, setRejectedCars] = useState<CarType[]>([]);

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

      // Load owner cars to check for rejected ones
      const cars = await ownerService.getOwnerCars();
      const rejected = cars.filter(
        (car) => car.approved === false && car.rejectionReason
      );
      setRejectedCars(rejected);
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Chủ Xe</h1>
          <p className="text-gray-600 mt-2">
            Xin chào, {user?.fullName}! Quản lý xe và đơn đặt xe của bạn
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Tổng số xe</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboard.totalCars}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Car className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <Link
              href="/owner/cars"
              className="text-blue-600 text-sm font-medium mt-3 inline-block hover:underline"
            >
              Xem chi tiết →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Tổng đơn đặt
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboard.totalBookings}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <Link
              href="/owner/bookings"
              className="text-green-600 text-sm font-medium mt-3 inline-block hover:underline"
            >
              Xem tất cả →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Doanh thu</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {dashboard.totalRevenue.toLocaleString("vi-VN")}đ
                </p>
                <p className="text-xs text-gray-600 mt-1">Từ đơn hoàn thành</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <Link
              href="/owner/analytics"
              className="text-purple-600 text-sm font-medium mt-3 inline-block hover:underline"
            >
              Xem chi tiết →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Đơn chờ duyệt
                </p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {dashboard.pendingBookings}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Đang thuê: {dashboard.activeRentals}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <Link
              href="/owner/bookings"
              className="text-orange-600 text-sm font-medium mt-3 inline-block hover:underline"
            >
              Xử lý ngay →
            </Link>
          </div>
        </div>

        {/* Rejected Cars Alert */}
        {rejectedCars.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-lg">
            <div className="flex items-start gap-4">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-3">
                  Xe bị từ chối duyệt ({rejectedCars.length})
                </h3>
                <div className="space-y-3">
                  {rejectedCars.map((car) => (
                    <div
                      key={car.id}
                      className="bg-white p-4 rounded-lg border border-red-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {car.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {car.brand} {car.model} - {car.licensePlate}
                          </p>
                          <div className="flex items-start gap-2 bg-red-50 p-3 rounded">
                            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-900 mb-1">
                                Lý do từ chối:
                              </p>
                              <p className="text-sm text-red-700">
                                {car.rejectionReason || "Không có lý do cụ thể"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/owner/cars/${car.id}/edit`}
                          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm whitespace-nowrap"
                        >
                          Chỉnh sửa
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-red-700 mt-3">
                  Vui lòng chỉnh sửa thông tin xe theo yêu cầu và gửi lại để
                  được duyệt.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Thao tác nhanh
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/owner/cars/new"
              className="flex items-center gap-3 p-4 bg-purple-50 border-2 border-purple-600 text-purple-700 rounded-lg hover:bg-purple-100 transition"
            >
              <div className="bg-purple-600 p-2 rounded-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Thêm xe mới</p>
                <p className="text-sm text-gray-600">
                  Đăng xe cho thuê của bạn
                </p>
              </div>
            </Link>

            <Link
              href="/owner/cars"
              className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-blue-600 text-blue-700 rounded-lg hover:bg-blue-100 transition"
            >
              <div className="bg-blue-600 p-2 rounded-lg">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Quản lý xe</p>
                <p className="text-sm text-gray-600">
                  Xem và chỉnh sửa xe của bạn
                </p>
              </div>
            </Link>

            <Link
              href="/owner/bookings"
              className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-600 text-green-700 rounded-lg hover:bg-green-100 transition"
            >
              <div className="bg-green-600 p-2 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Quản lý đơn đặt</p>
                <p className="text-sm text-gray-600">Xem và duyệt đơn đặt xe</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Hoạt động gần đây
          </h2>
          <div className="text-center py-8 text-gray-600">
            <p className="font-medium">Chưa có hoạt động nào</p>
            <p className="text-sm text-gray-600 mt-2">
              Thêm xe mới để bắt đầu nhận đơn đặt
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
