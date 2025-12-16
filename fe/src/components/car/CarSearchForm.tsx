"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, MapPinIcon, SearchIcon } from "lucide-react";

interface SearchFilters {
  location: string;
  startDate: string;
  endDate: string;
  seats?: number;
  transmission?: "MANUAL" | "AUTOMATIC";
  priceMin?: number;
  priceMax?: number;
}

export default function CarSearchForm() {
  const router = useRouter();
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    startDate: "",
    endDate: "",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate dates
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    const now = new Date();

    if (start < now) {
      alert("Không thể đặt xe trong quá khứ");
      return;
    }

    const hoursDiff = (start.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursDiff < 24) {
      alert("Phải đặt xe trước ít nhất 24 giờ");
      return;
    }

    if (end <= start) {
      alert("Ngày trả xe phải sau ngày nhận xe");
      return;
    }

    // Build query string
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPinIcon className="inline w-4 h-4 mr-1" />
            Địa điểm
          </label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            placeholder="Nhập địa điểm..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CalendarIcon className="inline w-4 h-4 mr-1" />
            Ngày nhận xe
          </label>
          <input
            type="datetime-local"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CalendarIcon className="inline w-4 h-4 mr-1" />
            Ngày trả xe
          </label>
          <input
            type="datetime-local"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <SearchIcon className="w-5 h-5" />
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
          Bộ lọc nâng cao
        </summary>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số chỗ ngồi
            </label>
            <select
              value={filters.seats || ""}
              onChange={(e) =>
                setFilters({ ...filters, seats: Number(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Tất cả</option>
              <option value="4">4 chỗ</option>
              <option value="5">5 chỗ</option>
              <option value="7">7 chỗ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Truyền động
            </label>
            <select
              value={filters.transmission || ""}
              onChange={(e) =>
                setFilters({ ...filters, transmission: e.target.value as any })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Tất cả</option>
              <option value="AUTOMATIC">Tự động</option>
              <option value="MANUAL">Số sàn</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá (VNĐ/ngày)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Từ"
                value={filters.priceMin || ""}
                onChange={(e) =>
                  setFilters({ ...filters, priceMin: Number(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Đến"
                value={filters.priceMax || ""}
                onChange={(e) =>
                  setFilters({ ...filters, priceMax: Number(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      </details>
    </form>
  );
}
