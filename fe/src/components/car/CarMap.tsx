"use client";

import { useEffect, useRef, useState } from "react";
import { Car } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface CarMapProps {
  cars: Car[];
  selectedCar?: Car | null;
  onCarSelect?: (car: Car) => void;
  height?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
}

export function CarMap({
  cars,
  selectedCar,
  onCarSelect,
  height = "500px",
  center = { lat: 21.0285, lng: 105.8542 }, // Hà Nội default
  zoom = 12,
}: CarMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Load Goong Map script
    if (!window.goongjs) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.js";
      script.async = true;
      script.onload = () => {
        const link = document.createElement("link");
        link.href = "https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.css";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        setMapLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.goongjs) return;

    const goongApiKey = process.env.NEXT_PUBLIC_GOONG_MAPTILES_KEY;
    
    if (!goongApiKey || goongApiKey === "YOUR_GOONG_MAPTILES_KEY_HERE") {
      console.error("Goong API key chưa được cấu hình trong .env.local");
      return;
    }

    // Initialize map
    if (!mapInstanceRef.current) {
      window.goongjs.accessToken = goongApiKey;
      
      const map = new window.goongjs.Map({
        container: mapRef.current,
        style: "https://tiles.goong.io/assets/goong_map_web.json",
        center: [center.lng, center.lat],
        zoom: zoom,
      });

      mapInstanceRef.current = map;

      map.addControl(new window.goongjs.NavigationControl(), "top-right");
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers for cars
    cars.forEach((car) => {
      if (car.latitude && car.longitude) {
        // Create simple marker element
        const el = document.createElement("div");
        el.className = "car-marker";
        el.innerHTML = `
          <div style="
            width: 32px;
            height: 32px;
            background: ${selectedCar?.id === car.id ? "#7c3aed" : "#fff"};
            border: 3px solid #7c3aed;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: all 0.2s;
          ">
            🚗
          </div>
        `;

        el.addEventListener("mouseenter", () => {
          const child = el.firstElementChild as HTMLElement;
          if (child) child.style.transform = "scale(1.2)";
        });
        
        el.addEventListener("mouseleave", () => {
          const child = el.firstElementChild as HTMLElement;
          if (child) child.style.transform = "scale(1)";
        });

        const marker = new window.goongjs.Marker({
          element: el,
          anchor: "center"
        })
          .setLngLat([car.longitude, car.latitude])
          .addTo(mapInstanceRef.current);

        // Create detailed popup (only shows when clicked)
        const popup = new window.goongjs.Popup({ 
          offset: 15,
          closeButton: true,
          closeOnClick: false,
          maxWidth: "300px"
        }).setHTML(`
          <div style="padding: 12px;">
            <div style="display: flex; align-items: start; gap: 10px; margin-bottom: 10px;">
              <div style="
                background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
                color: white;
                width: 42px;
                height: 42px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                flex-shrink: 0;
              ">
                🚗
              </div>
              <div style="flex: 1; min-width: 0;">
                <h3 style="font-weight: 700; font-size: 15px; margin: 0 0 3px 0; color: #111827;">${car.name}</h3>
                <p style="font-size: 12px; color: #6b7280; margin: 0;">
                  ${car.brand} ${car.model} • ${car.year}
                </p>
              </div>
            </div>
            
            <div style="
              background: #f9fafb;
              border-radius: 8px;
              padding: 8px;
              margin-bottom: 10px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 6px;
              font-size: 12px;
            ">
              <div style="display: flex; align-items: center; gap: 5px; color: #374151;">
                <span>👥</span>
                <span>${car.seats} chỗ</span>
              </div>
              <div style="display: flex; align-items: center; gap: 5px; color: #374151;">
                <span>⚙️</span>
                <span>${car.transmission === 'AUTOMATIC' ? 'Tự động' : 'Số sàn'}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 5px; color: #374151;">
                <span>⛽</span>
                <span>${car.fuelType === 'GASOLINE' ? 'Xăng' : car.fuelType === 'DIESEL' ? 'Dầu' : car.fuelType === 'ELECTRIC' ? 'Điện' : 'Hybrid'}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 5px; color: #374151;">
                <span>📍</span>
                <span>${car.location || 'HN'}</span>
              </div>
            </div>

            <div style="
              background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
              padding: 10px;
              border-radius: 8px;
              margin-bottom: 10px;
              text-align: center;
            ">
              <p style="font-size: 10px; color: #7c3aed; margin: 0 0 3px 0; font-weight: 600; text-transform: uppercase;">Giá thuê</p>
              <p style="font-size: 18px; font-weight: 700; color: #7c3aed; margin: 0;">
                ${formatCurrency(car.pricePerDay)}
                <span style="font-size: 12px; font-weight: 500; color: #9333ea;">/ngày</span>
              </p>
              ${car.averageRating > 0 ? `
                <div style="
                  display: inline-block;
                  background: #fef3c7;
                  color: #92400e;
                  padding: 3px 8px;
                  border-radius: 10px;
                  font-size: 11px;
                  font-weight: 600;
                  margin-top: 5px;
                ">
                  ⭐ ${car.averageRating.toFixed(1)}
                </div>
              ` : ''}
            </div>

            ${car.totalTrips > 0 ? `
              <div style="
                font-size: 11px;
                color: #059669;
                text-align: center;
                font-weight: 600;
                margin-bottom: 10px;
              ">
                ✓ ${car.totalTrips} chuyến đã hoàn thành
              </div>
            ` : ''}
            
            <a 
              href="/cars/${car.id}" 
              style="
                display: block;
                background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
                color: white;
                text-align: center;
                padding: 10px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                font-size: 13px;
                box-shadow: 0 2px 6px rgba(124, 58, 237, 0.3);
              "
              onmouseover="this.style.background='linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%)'"
              onmouseout="this.style.background='linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'"
            >
              Xem chi tiết & Đặt xe →
            </a>
          </div>
        `);

        // Show popup on marker click
        el.addEventListener("click", () => {
          marker.togglePopup();
          if (onCarSelect) {
            onCarSelect(car);
          }
        });

        markersRef.current.push(marker);
      }
    });

    // Fit bounds if multiple cars
    if (cars.length > 1 && cars.some((c) => c.latitude && c.longitude)) {
      const bounds = new window.goongjs.LngLatBounds();
      cars.forEach((car) => {
        if (car.latitude && car.longitude) {
          bounds.extend([car.longitude, car.latitude]);
        }
      });
      mapInstanceRef.current.fitBounds(bounds, { padding: 50 });
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [mapLoaded, cars, selectedCar, center, zoom, onCarSelect]);

  if (!mapLoaded) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center bg-gray-100 rounded-lg"
      >
        <p className="text-gray-600">Đang tải bản đồ...</p>
      </div>
    );
  }

  return <div ref={mapRef} style={{ height, width: "100%" }} className="rounded-lg" />;
}

declare global {
  interface Window {
    goongjs: any;
  }
}
