"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Car } from "@/types";
import { carService } from "@/lib/services/carService";
import { formatCurrency } from "@/lib/utils";
import { CarMap } from "@/components/car/CarMap";
import {
  Search,
  Star,
  Shield,
  Clock,
  CheckCircle,
  ShieldCheck,
  MapPin,
} from "lucide-react";

export default function HomePage() {
  const [topCars, setTopCars] = useState<Car[]>([]);
  const [availableCars, setAvailableCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const [rated, available] = await Promise.all([
        carService.getTopRatedCars(),
        carService.getAvailableCars(),
      ]);
      setTopCars(rated.slice(0, 6));
      setAvailableCars(available);
    } catch (error) {
      console.error("Error loading cars:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Thuê xe tự lái dễ dàng</h1>
          <p className="text-xl mb-8">
            Trải nghiệm tự do với đa dạng dòng xe hiện đại, giá cả hợp lý
          </p>
          <Link
            href="/cars"
            className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-50 transition inline-block"
          >
            Khám phá ngay
          </Link>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-8">
            <MapPin className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Xe có sẵn gần bạn
            </h2>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {loading ? (
              <div className="h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Đang tải bản đồ...</p>
                </div>
              </div>
            ) : (
              <CarMap
                cars={availableCars}
                selectedCar={selectedCar}
                onCarSelect={setSelectedCar}
                height="500px"
              />
            )}
          </div>
          {selectedCar && (
            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedCar.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedCar.brand} {selectedCar.model} - {selectedCar.year}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-700 mb-4">
                    <span>👥 {selectedCar.seats} chỗ</span>
                    <span>
                      ⚙️{" "}
                      {selectedCar.transmission === "AUTOMATIC"
                        ? "Tự động"
                        : "Số sàn"}
                    </span>
                    <span>⛽ {selectedCar.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-purple-600">
                      {formatCurrency(selectedCar.pricePerDay)}
                    </span>
                    <span className="text-gray-600">/ngày</span>
                  </div>
                </div>
                <Link
                  href={`/cars/${selectedCar.id}`}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Tại sao chọn chúng tôi?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <FeatureCard
              icon={<CheckCircle className="w-12 h-12 text-purple-600" />}
              title="Dòng Xe Đa Dạng"
              description="Hơn 100+ dòng xe phù hợp mọi nhu cầu."
            />
            <FeatureCard
              icon={<Star className="w-12 h-12 text-purple-600" />}
              title="Giá Tốt Nhất"
              description="Cam kết giá cả cạnh tranh nhất thị trường."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-12 h-12 text-purple-600" />}
              title="Bảo Hiểm Toàn Diện"
              description="Xe được bảo hiểm đầy đủ"
            />
            <FeatureCard
              icon={<Clock className="w-12 h-12 text-purple-600" />}
              title="Hỗ Trợ 24/7"
              description="Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn mọi lúc mọi nơi."
            />
          </div>
        </div>
      </section>

      {/* Popular Cars */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Xe Cho Thuê Phổ Biến
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {topCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link
              href="/cars"
              className="text-purple-600 font-semibold hover:text-purple-700 transition"
            >
              Xem tất cả xe →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}

function CarCard({ car }: { car: Car }) {
  return (
    <Link href={`/cars/${car.id}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{car.name}</h3>
          <div className="flex items-center text-sm text-gray-700 mb-4">
            <span className="mr-4">👥 {car.seats} chỗ</span>
            <span>
              ⚙️ {car.transmission === "AUTOMATIC" ? "Tự động" : "Số sàn"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-purple-600">
                {formatCurrency(car.pricePerDay)}
              </span>
              <span className="text-gray-600">/ngày</span>
            </div>
            {car.averageRating > 0 && (
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-1 font-semibold">
                  {car.averageRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
