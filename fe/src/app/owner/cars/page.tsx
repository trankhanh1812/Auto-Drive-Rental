"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { carService } from "@/lib/services/carService";
import { ownerService } from "@/lib/services/ownerService";
import { Car as CarIcon, Plus, Edit, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserRole, Car } from "@/types";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function OwnerCarsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/owner/cars");
      return;
    }

    if (user && user.role !== UserRole.OWNER) {
      router.push("/");
      return;
    }

    loadCars();
  }, [isAuthenticated, user]);

  const loadCars = async () => {
    setLoading(true);
    try {
      const ownerCars = await ownerService.getOwnerCars();
      setCars(ownerCars);
    } catch (err: any) {
      setError("Không thể tải danh sách xe");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa xe này?")) return;

    try {
      await carService.deleteCar(id);
      setCars(cars.filter((car) => car.id !== id));
      alert("Xóa xe thành công!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Xóa xe thất bại");
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản Lý Xe</h1>
            <p className="text-gray-600 mt-2">
              Danh sách xe cho thuê của bạn
            </p>
          </div>
          <Link
            href="/owner/cars/new"
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            <Plus className="w-5 h-5" />
            Thêm xe mới
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Cars Grid */}
        {cars.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <CarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có xe nào
            </h3>
            <p className="text-gray-600 mb-6">
              Thêm xe đầu tiên để bắt đầu cho thuê
            </p>
            <Link
              href="/owner/cars/new"
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              <Plus className="w-5 h-5" />
              Thêm xe ngay
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  {car.images && car.images.length > 0 ? (
                    <img
                      src={car.images[0]}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white text-6xl">
                      🚗
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {car.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {car.brand} {car.model} - {car.year}
                  </p>

                  <div className="flex items-center justify-between mb-4 pb-4 border-b">
                    <div>
                      <span className="text-2xl font-bold text-purple-600">
                        {formatCurrency(car.pricePerDay)}
                      </span>
                      <span className="text-gray-600 text-sm">/ngày</span>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        car.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {car.isAvailable ? "Sẵn sàng" : "Đang thuê"}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/cars/${car.id}`}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Xem
                    </Link>
                    <button
                      onClick={() => router.push(`/owner/cars/${car.id}/edit`)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(car.id)}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
