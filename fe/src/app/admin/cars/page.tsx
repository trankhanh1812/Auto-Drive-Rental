'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { UserRole, Car } from '@/types';
import { adminService } from '@/lib/services/adminService';
import { Car as CarIcon, Check, X, Clock, AlertCircle } from 'lucide-react';

export default function AdminCarsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/admin/cars');
      return;
    }

    if (user && user.role !== UserRole.ADMIN) {
      alert('Bạn không có quyền truy cập');
      router.push('/');
      return;
    }

    loadPendingCars();
  }, [isAuthenticated, user]);

  const loadPendingCars = async () => {
    try {
      setLoading(true);
      const data = await adminService.getPendingCars();
      setCars(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải danh sách xe');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (carId: number) => {
    if (!confirm('Xác nhận duyệt xe này?')) return;

    try {
      setProcessing(carId);
      await adminService.approveCar(carId);
      alert('Đã duyệt xe thành công');
      loadPendingCars();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể duyệt xe');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (carId: number) => {
    const reason = prompt('Lý do từ chối (tùy chọn):');
    if (reason === null) return;

    try {
      setProcessing(carId);
      await adminService.rejectCar(carId, reason);
      alert('Đã từ chối xe');
      loadPendingCars();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể từ chối xe');
    } finally {
      setProcessing(null);
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
            <CarIcon className="w-8 h-8 text-blue-600" />
            Duyệt xe mới
          </h1>
          <p className="text-gray-600 mt-2">
            Xem xét và phê duyệt xe được đăng ký bởi chủ xe
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {cars.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Không có xe chờ duyệt</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cars.map((car) => (
              <div key={car.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <CarIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {car.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {car.brand} {car.model} ({car.year})
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Biển số: {car.licensePlate}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Giá: {car.pricePerDay?.toString()} VNĐ/ngày
                    </p>
                    <p className="text-gray-500 text-sm">
                      Vị trí: {car.location || 'Chưa cập nhật'}
                    </p>
                  </div>
                </div>

                {car.description && (
                  <p className="text-gray-600 text-sm mt-4 p-3 bg-gray-50 rounded">
                    {car.description}
                  </p>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleApprove(car.id)}
                    disabled={processing === car.id}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    {processing === car.id ? 'Đang xử lý...' : 'Duyệt'}
                  </button>
                  <button
                    onClick={() => handleReject(car.id)}
                    disabled={processing === car.id}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Từ chối
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
