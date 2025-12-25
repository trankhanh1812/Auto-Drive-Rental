"use client";

import Image from "next/image";
import Link from "next/link";
import {
  StarIcon,
  UsersIcon,
  CogIcon,
  FuelIcon,
  MapPinIcon,
} from "lucide-react";

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  seats: number;
  transmission: string;
  fuelType: string;
  rating: number;
  ratingCount: number;
  locationAddress: string;
  images: string[];
}

export default function CarCard({ car }: { car: Car }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const imageUrl = (car.images && car.images.length > 0) 
    ? car.images[0] 
    : "/placeholder-car.jpg";

  return (
    <Link href={`/car/${car.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden group">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imageUrl}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover group-hover:scale-110 transition duration-300"
          />
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full flex items-center gap-1">
            <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">
              {car.rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-600 font-medium">({car.ratingCount})</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            {car.brand} {car.model} {car.year}
          </h3>

          <div className="flex items-center text-sm text-gray-700 mb-3 font-medium">
            <MapPinIcon className="w-4 h-4 mr-1" />
            <span className="truncate">{car.locationAddress}</span>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <UsersIcon className="w-4 h-4" />
              <span>{car.seats} chỗ</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <CogIcon className="w-4 h-4" />
              <span>
                {car.transmission === "AUTOMATIC" ? "Tự động" : "Số sàn"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <FuelIcon className="w-4 h-4" />
              <span>{car.fuelType}</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between border-t pt-3">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {formatPrice(car.pricePerDay)}
              </p>
              <p className="text-xs text-gray-600 font-medium">/ ngày</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Thuê ngay
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
