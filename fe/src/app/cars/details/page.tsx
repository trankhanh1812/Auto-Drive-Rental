import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Car } from "@/types";
import { carService } from "@/lib/services/carService";
import { formatCurrency } from "@/lib/utils";
import { Fuel, MapPin, Settings, Shield, Star, Users } from "lucide-react";

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCar();
  }, [params.id]);

  const loadCar = async () => {
    try {
      const data = await carService.getCarById(Number(params.id));
      setCar(data);
    } catch (error) {
      console.error("Error loading car:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/cars/" + params.id);
      return;
    }
    router.push(`/booking?carId=${params.id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
    );
  }
  if (!car) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        Car not found.
      </div>
    );
  }
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Car image */}
          <div className="bg-gradient-to-r from-purple-400 to-indigo-500 rounded-lg h-96 flex items-center justify-center text-white text-9xl">
            🚗
          </div>
          {/* Car details */}
          <div>
            <h1 className="text-4xl font-bold mb-2">{car.name}</h1>
            <p className="text-gray-600 mb-4">
              {car.brand} {car.model} - {car.year}
            </p>
            {car.averageRating > 0 && (
              <div className="flex items-center mb-6">
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <span className="ml-2 text-xl font-semibold">
                  {car.averageRating.toFixed(1)}
                </span>
                <span className="ml-2 text-gray-600">
                  ({car.totalTrips} chuyến)
                </span>
              </div>
            )}
            <div className="bg-purple-50 p-6 rounded-lg mb-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {formatCurrency(car.pricePerDay)}
                <span className="text-lg text-gray-600 font-normal">/ngày</span>
              </div>
            </div>
            {/* Specs */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-600" />
                <span>{car.seats} chỗ</span>
              </div>
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-gray-600" />
                <span>
                  {car.transmission === "AUTOMATIC" ? "Tự động" : "Số sàn"}
                </span>
                <div className="flex items-center space-x-2">
                  <Fuel className="w-5 h-5 text-gray-600" />
                  <span>{car.fuelType}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <span>{car.location}</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                className="w-full bg-purple-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition"
              >
                Đặt xe ngay
              </button>
            </div>
          </div>
          {/* Description */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Mô tả</h2>
            <p className="text-gray-700 leading-relaxed">{car.description}</p>
          </div>

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Tiện nghi</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {Array.from(car.features).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
