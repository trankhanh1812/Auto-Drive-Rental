'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';
import { adminService } from '@/lib/services/adminService';
import Link from 'next/link';
import { 
  Car, 
  Users, 
  Settings, 
  AlertCircle,
  CheckCircle,
  Shield
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingCarsCount: 0,
    totalUsersCount: 0,
    complaintsCount: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/admin/dashboard');
      return;
    }

    if (user && user.role !== UserRole.ADMIN) {
      alert('Bạn không có quyền truy cập trang này');
      router.push('/');
      return;
    }

    loadStats();
  }, [isAuthenticated, user]);

  const loadStats = async () => {
    try {
      const data = await adminService.getAdminStats();
      setStats(data);
    } catch (err: any) {
      console.error('Error loading stats:', err);
      console.error('Error response:', err.response?.data);
      // Fallback to 0 if error
      setStats({
        pendingCarsCount: 0,
        totalUsersCount: 0,
        complaintsCount: 0,
      });
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-600" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Quản trị hệ thống - Xin chào, {user?.fullName}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Xe chờ duyệt</p>
                <p className="text-3xl font-bold mt-2">{stats.pendingCarsCount}</p>
              </div>
              <Car className="w-12 h-12 text-blue-200" />
            </div>
            <Link href="/admin/cars" className="text-sm text-blue-100 hover:text-white mt-4 inline-block">
              Xem chi tiết →
            </Link>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Người dùng</p>
                <p className="text-3xl font-bold mt-2">{stats.totalUsersCount}</p>
              </div>
              <Users className="w-12 h-12 text-green-200" />
            </div>
            <Link href="/admin/users" className="text-sm text-green-100 hover:text-white mt-4 inline-block">
              Quản lý →
            </Link>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Khiếu nại</p>
                <p className="text-3xl font-bold mt-2">{stats.complaintsCount}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-orange-200" />
            </div>
            <Link href="/admin/complaints" className="text-sm text-orange-100 hover:text-white mt-4 inline-block">
              Xử lý →
            </Link>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/cars"
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
          >
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Duyệt xe mới
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Xem xét và phê duyệt xe mới được đăng ký bởi chủ xe
                </p>
                <div className="mt-3 text-blue-600 text-sm font-medium">
                  Xem danh sách →
                </div>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
          >
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Quản lý người dùng
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Xem, chỉnh sửa, cấm/bỏ cấm tài khoản người dùng
                </p>
                <div className="mt-3 text-green-600 text-sm font-medium">
                  Quản lý →
                </div>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/settings"
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
          >
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Cấu hình hệ thống
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Điều chỉnh các thiết lập chung của hệ thống
                </p>
                <div className="mt-3 text-purple-600 text-sm font-medium">
                  Cài đặt →
                </div>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/complaints"
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
          >
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Xử lý khiếu nại
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Xem và giải quyết khiếu nại từ người dùng
                </p>
                <div className="mt-3 text-orange-600 text-sm font-medium">
                  Xử lý →
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
