"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Car, CarType, TransmissionType, FuelType } from "@/types";
import { carService } from "@/lib/services/carService";
import { formatCurrency } from "@/lib/utils";
import { Search, Star, Filter, SlidersHorizontal } from "lucide-react";

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    searchQuery: "",
    carType: "ALL",
    transmission: "ALL",
    fuelType: "ALL",
    minPrice: "",
    maxPrice: "",
    minSeats: "",
  });

  useEffect(() => {
    loadCars();
  }, []);

  useEffect(() => {
    filterCars();
  }, [filters, cars]);

  const loadCars = async () => {
    try {
      const data = await carService.getAvailableCars();
      setCars(data);
      setFilteredCars(data);
    } catch (error) {
      console.error("Error loading cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterCars = () => {
    let filtered = [...cars];

    // Filter by search query
    if (filters.searchQuery) {
      filtered = filtered.filter(
        (car) =>
          car.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          car.brand.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          car.model.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    // Filter by car type
    if (filters.carType !== "ALL") {
      filtered = filtered.filter((car) => car.carType === filters.carType);
    }

    // Filter by transmission
    if (filters.transmission !== "ALL") {
      filtered = filtered.filter((car) => car.transmission === filters.transmission);
    }

    // Filter by fuel type
    if (filters.fuelType !== "ALL") {
      filtered = filtered.filter((car) => car.fuelType === filters.fuelType);
    }

    // Filter by price range
    if (filters.minPrice) {
      filtered = filtered.filter((car) => car.pricePerDay >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((car) => car.pricePerDay <= parseFloat(filters.maxPrice));
    }

    // Filter by seats
    if (filters.minSeats) {
      filtered = filtered.filter((car) => car.seats >= parseInt(filters.minSeats));
    }

    setFilteredCars(filtered);
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: "",
      carType: "ALL",
      transmission: "ALL",
      fuelType: "ALL",
      minPrice: "",
      maxPrice: "",
      minSeats: "",
    });
  };

  return (
    <div className="py-6 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Xe cho thuê</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, hãng, dòng xe..."
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters({ ...filters, searchQuery: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Car Type */}
            <select
              value={filters.carType}
              onChange={(e) => setFilters({ ...filters, carType: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900"
            >
              <option value="ALL">Tất cả loại xe</option>
              {Object.values(CarType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {showAdvancedFilters ? "Ẩn" : "Hiện"} bộ lọc nâng cao
          </button>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="grid md:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hộp số
                </label>
                <select
                  value={filters.transmission}
                  onChange={(e) =>
                    setFilters({ ...filters, transmission: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-gray-900"
                >
                  <option value="ALL">Tất cả</option>
                  <option value={TransmissionType.AUTOMATIC}>Tự động</option>
                  <option value={TransmissionType.MANUAL}>Số sàn</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhiên liệu
                </label>
                <select
                  value={filters.fuelType}
                  onChange={(e) =>
                    setFilters({ ...filters, fuelType: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-gray-900"
                >
                  <option value="ALL">Tất cả</option>
                  {Object.values(FuelType).map((fuel) => (
                    <option key={fuel} value={fuel}>
                      {fuel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá tối thiểu (VNĐ)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá tối đa (VNĐ)
                </label>
                <input
                  type="number"
                  placeholder="10000000"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số chỗ tối thiểu
                </label>
                <select
                  value={filters.minSeats}
                  onChange={(e) =>
                    setFilters({ ...filters, minSeats: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-gray-900"
                >
                  <option value="">Tất cả</option>
                  <option value="4">4+ chỗ</option>
                  <option value="5">5+ chỗ</option>
                  <option value="7">7+ chỗ</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-700 font-medium">
            Tìm thấy <span className="text-purple-600 font-bold">{filteredCars.length}</span> xe
          </p>
        </div>

        {/* Car Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg">Không tìm thấy xe phù hợp</p>
            <p className="text-gray-500 mt-2">Thử thay đổi bộ lọc để xem thêm kết quả</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CarCard({ car }: { car: Car }) {
  return (
    <Link href={`/cars/${car.id}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition h-full">
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
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{car.name}</h3>
            {car.averageRating > 0 && (
              <div className="flex items-center">
                <Star className="text-yellow-400 w-4 h-4 fill-current" />
                <span className="ml-1 text-sm font-semibold text-gray-900">
                  {car.averageRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-4">
            {car.brand} {car.model} - {car.year}
          </p>
          <div className="flex items-center text-sm text-gray-700 mb-4 space-x-4">
            <span>👥 {car.seats} chỗ</span>
            <span>
              ⚙️ {car.transmission === "AUTOMATIC" ? "Tự động" : "Số sàn"}
            </span>
            <span>⛽ {car.fuelType}</span>
          </div>
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <span className="text-2xl font-bold text-purple-600">
                {formatCurrency(car.pricePerDay)}
              </span>
              <span className="text-gray-600 text-sm">/ngày</span>
            </div>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
              Đặt xe
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
