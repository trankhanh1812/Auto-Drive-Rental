"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { carService } from "@/lib/services/carService";
import { bookingService } from "@/lib/services/bookingService";
import { useRouter, useParams } from "next/navigation";
import { Car } from "@/types";
import { CalendarIcon, MapPinIcon, CarIcon } from "lucide-react";

export default function BookCarPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const carId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    pickupLocation: "",
    dropoffLocation: "",
    notes: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/cars/${carId}/book`);
      return;
    }

    loadCar();
  }, [isAuthenticated, carId]);

  const loadCar = async () => {
    try {
      setLoading(true);
      const data = await carService.getCarById(Number(carId));
      setCar(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải thông tin xe");
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : 0;
  };

  const calculateTotal = () => {
    if (!car) return 0;
    return calculateDays() * car.pricePerDay;
  };

  const calculateDeposit = () => {
    return Math.round(calculateTotal() * 0.3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.startDate || !formData.endDate) {
      setError("Vui lòng chọn ngày bắt đầu và kết thúc");
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError("Ngày kết thúc phải sau ngày bắt đầu");
      return;
    }

    if (!formData.pickupLocation) {
      setError("Vui lòng nhập địa điểm nhận xe");
      return;
    }

    try {
      setSubmitting(true);
      const booking = await bookingService.createBooking({
        carId: Number(carId),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        pickupLocation: formData.pickupLocation,
        dropoffLocation: formData.dropoffLocation,
        notes: formData.notes,
        deposit: calculateDeposit(),
      });

      // Redirect to payment page
      router.push(
        `/payment?bookingId=${booking.id}&orderCode=${booking.orderCode}`
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tạo đơn đặt xe");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy xe</p>
          <button
            onClick={() => router.push("/cars")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const totalDays = calculateDays();
  const totalPrice = calculateTotal();
  const deposit = calculateDeposit();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <CarIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Đặt xe</h1>
          </div>

          {/* Car Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-lg mb-2 text-gray-900">
              {car.name}
            </h2>
            <p className="text-gray-600">
              {car.brand} {car.model} - {car.year}
            </p>
            <p className="text-gray-600">Biển số: {car.licensePlate}</p>
            <p className="text-xl font-bold text-blue-600 mt-2">
              {car.pricePerDay.toLocaleString()} VNĐ/ngày
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CalendarIcon className="inline w-4 h-4 mr-1" />
                  Ngày bắt đầu *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full text-gray-500 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CalendarIcon className="inline w-4 h-4 mr-1" />
                  Ngày kết thúc *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  min={
                    formData.startDate || new Date().toISOString().slice(0, 16)
                  }
                  className="w-full text-gray-500 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPinIcon className="inline w-4 h-4 mr-1" />
                Địa điểm nhận xe *
              </label>
              <input
                type="text"
                required
                value={formData.pickupLocation}
                onChange={(e) =>
                  setFormData({ ...formData, pickupLocation: e.target.value })
                }
                className="w-full text-gray-500 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="VD: 123 Đường ABC, Quận XYZ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPinIcon className="inline w-4 h-4 mr-1" />
                Địa điểm trả xe (tùy chọn)
              </label>
              <input
                type="text"
                value={formData.dropoffLocation}
                onChange={(e) =>
                  setFormData({ ...formData, dropoffLocation: e.target.value })
                }
                className="w-full text-gray-500 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Để trống nếu trùng với địa điểm nhận xe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                className="w-full text-gray-500 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Thông tin bổ sung..."
              />
            </div>

            {/* Price Summary */}
            {totalDays > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Tóm tắt giá
                </h3>
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Số ngày thuê:</span>
                    <span className="font-medium">{totalDays} ngày</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Đơn giá:</span>
                    <span className="font-medium">
                      {car.pricePerDay.toLocaleString()} VNĐ/ngày
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">
                      {totalPrice.toLocaleString()} VNĐ
                    </span>
                  </div>
                  <div className="flex justify-between text-orange-600">
                    <span>Đặt cọc (30%):</span>
                    <span className="font-semibold">
                      {deposit.toLocaleString()} VNĐ
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting || totalDays === 0}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? "Đang xử lý..." : "Tiếp tục thanh toán"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
