'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { useEffect } from 'react';

export default function AdminSettingsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/admin/settings');
      return;
    }

    if (user && user.role !== UserRole.ADMIN) {
      alert('Bạn không có quyền truy cập');
      router.push('/');
    }
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-purple-600" />
            Cấu hình hệ thống
          </h1>
          <p className="text-gray-600 mt-2">
            Điều chỉnh các thiết lập chung của hệ thống
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tỷ lệ hoa hồng (%)
              </label>
              <input
                type="number"
                defaultValue={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Hoa hồng trên mỗi giao dịch thành công
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số ngày thuê tối đa
              </label>
              <input
                type="number"
                defaultValue={30}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Giới hạn số ngày thuê xe trong một lần đặt
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian hủy miễn phí (giờ)
              </label>
              <input
                type="number"
                defaultValue={24}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Thời gian cho phép hủy đơn mà không mất phí
              </p>
            </div>

            <div className="pt-4 border-t">
              <button className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2">
                <Save className="w-5 h-5" />
                Lưu cấu hình
              </button>
              <p className="text-center text-sm text-gray-500 mt-3">
                Chức năng đang trong giai đoạn phát triển
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
