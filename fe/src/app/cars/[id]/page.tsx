"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { carService } from "@/lib/services/carService";
import { reviewService } from "@/lib/services/reviewService";
import { Car, Review } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  Star,
  MapPin,
  Calendar,
  Users,
  Fuel,
  Settings,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import ReviewList from "@/components/booking/ReviewList";

export default function CarDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadCarDetails();
      loadReviews();
    }
  }, [params.id]);

  const loadCarDetails = async () => {
    setLoading(true);
    try {
      const data = await carService.getCarById(Number(params.id));
      setCar(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải thông tin xe");
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const data = await reviewService.getCarReviews(Number(params.id));
      setReviews(data);
    } catch (err) {
      console.error("Failed to load reviews:", err);
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

  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg max-w-md text-center">
          <p className="font-semibold mb-2">Lỗi</p>
          <p>{error || "Không tìm thấy xe"}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images & Video */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-96 bg-gray-200 overflow-hidden flex items-center justify-center">
                {showVideo && car.videoUrl ? (
                  <video
                    src={car.videoUrl}
                    controls
                    className="max-w-full max-h-full object-contain"
                  />
                ) : car.images && car.images.length > 0 ? (
                  <img
                    src={car.images[selectedImage]}
                    alt={car.name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white text-8xl">
                    🚗
                  </div>
                )}
              </div>
              {/* Thumbnail gallery */}
              <div className="flex gap-2 p-4 overflow-x-auto bg-gray-50">
                {/* Video thumbnail */}
                {car.videoUrl && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition relative ${
                      showVideo
                        ? "border-purple-600"
                        : "border-gray-300 hover:border-purple-400"
                    }`}
                  >
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-2xl">
                      ▶️
                    </div>
                  </button>
                )}
                {/* Image thumbnails */}
                {car.images &&
                  car.images.length > 0 &&
                  car.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setShowVideo(false);
                        setSelectedImage(index);
                      }}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                        !showVideo && selectedImage === index
                          ? "border-purple-600"
                          : "border-gray-300 hover:border-purple-400"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${car.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
              </div>
            </div>

            {/* Car Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {car.name}
                  </h1>
                  <p className="text-gray-600">
                    {car.brand} {car.model} - {car.year}
                  </p>
                </div>
                {car.averageRating > 0 && (
                  <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-bold text-gray-900">
                      {car.averageRating.toFixed(1)}
                    </span>
                    <span className="text-gray-600 text-sm">
                      ({car.totalTrips} chuyến)
                    </span>
                  </div>
                )}
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500">Số chỗ</p>
                    <p className="font-semibold text-gray-900">
                      {car.seats} chỗ
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Settings className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500">Hộp số</p>
                    <p className="font-semibold text-gray-900">
                      {car.transmission === "AUTOMATIC" ? "Tự động" : "Số sàn"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Fuel className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500">Nhiên liệu</p>
                    <p className="font-semibold text-gray-900">
                      {car.fuelType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500">Vị trí</p>
                    <p className="font-semibold text-gray-900">
                      {car.location || "Hà Nội"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Mô tả</h3>
                <p className="text-gray-700 leading-relaxed">
                  {car.description ||
                    "Xe trong tình trạng tốt, sạch sẽ, bảo dưỡng định kỳ."}
                </p>
              </div>

              {/* Features */}
              {car.features && car.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Tính năng
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {car.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Đánh giá từ khách hàng
                </h3>
                <ReviewList reviews={reviews} />
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-purple-600">
                    {formatCurrency(car.pricePerDay)}
                  </span>
                  <span className="text-gray-600">/ngày</span>
                </div>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    car.isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {car.isAvailable ? "✓ Sẵn sàng" : "✗ Đang được thuê"}
                </div>
              </div>

              {car.isAvailable && (
                <>
                  <button
                    onClick={() => router.push(`/cars/${car.id}/book`)}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition mb-4"
                  >
                    Đặt xe ngay
                  </button>

                  <div className="text-center text-sm text-gray-500">
                    <p>Đặt cọc 30% khi đặt xe</p>
                    <p>Miễn phí hủy trong 24h</p>
                  </div>
                </>
              )}

              {!car.isAvailable && (
                <div className="text-center py-4 text-gray-500">
                  <p className="font-medium">Xe hiện không khả dụng</p>
                  <p className="text-sm text-gray-600">Vui lòng chọn xe khác</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
