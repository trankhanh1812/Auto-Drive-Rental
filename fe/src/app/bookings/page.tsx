"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { bookingService } from "@/lib/services/bookingService";
import { paymentService } from "@/lib/services/paymentService";
import { Booking, BookingStatus } from "@/types";
import { useRouter } from "next/navigation";
import { Calendar, Car, MapPin, Clock, CheckCircle, XCircle, Loader2, Star, DollarSign } from "lucide-react";
import ReviewForm from "@/components/booking/ReviewForm";

export default function MyBookingsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<BookingStatus | "ALL">("ALL");
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/bookings");
      return;
    }

    loadBookings();
  }, [isAuthenticated]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải danh sách đặt xe");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalPayment = async (bookingId: number) => {
    try {
      const payment = await paymentService.createFinalPayment(bookingId);
      router.push(`/payment?bookingId=${bookingId}&orderCode=${payment.orderCode}`);
    } catch (err: any) {
      alert(err.response?.data?.message || "Không thể tạo thanh toán");
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    const badges: Record<BookingStatus, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-green-100 text-green-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-gray-100 text-gray-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: BookingStatus) => {
    const texts: Record<BookingStatus, string> = {
      PENDING: "Chờ duyệt",
      CONFIRMED: "Đã duyệt",
      IN_PROGRESS: "Đang thuê",
      COMPLETED: "Hoàn thành",
      CANCELLED: "Đã hủy",
    };
    return texts[status] || status;
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case BookingStatus.CONFIRMED:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case BookingStatus.CANCELLED:
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Car className="w-5 h-5 text-blue-600" />;
    }
  };

  const filteredBookings =
    filter === "ALL"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto" />
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Đơn đặt xe của tôi
            </h1>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          {/* Filters */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "ALL"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tất cả ({bookings.length})
            </button>
            <button
              onClick={() => setFilter(BookingStatus.PENDING)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === BookingStatus.PENDING
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Chờ duyệt (
              {bookings.filter((b) => b.status === BookingStatus.PENDING).length})
            </button>
            <button
              onClick={() => setFilter(BookingStatus.CONFIRMED)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === BookingStatus.CONFIRMED
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Đã duyệt (
              {bookings.filter((b) => b.status === BookingStatus.CONFIRMED).length})
            </button>
            <button
              onClick={() => setFilter(BookingStatus.COMPLETED)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === BookingStatus.COMPLETED
                  ? "bg-gray-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Hoàn thành (
              {bookings.filter((b) => b.status === BookingStatus.COMPLETED).length})
            </button>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">
                {filter === "ALL"
                  ? "Bạn chưa có đơn đặt xe nào"
                  : "Không có đơn đặt xe nào"}
              </p>
              <button
                onClick={() => router.push("/cars")}
                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Tìm xe để thuê
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition cursor-pointer"
                  onClick={() => {
                    if (booking.status === BookingStatus.PENDING && booking.orderCode) {
                      router.push(`/payment?orderCode=${booking.orderCode}`);
                    }
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(booking.status)}
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {booking.carName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {booking.carBrand} {booking.carModel}
                          {booking.carLicensePlate && ` - ${booking.carLicensePlate}`}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 font-medium">
                          Mã đơn: {booking.bookingCode}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                        booking.status
                      )}`}
                    >
                      {getStatusText(booking.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Từ</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(booking.startDate).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Đến</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(booking.endDate).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Số ngày</p>
                        <p className="text-sm font-medium text-gray-900">
                          {booking.totalDays} ngày
                        </p>
                      </div>
                    </div>
                  </div>

                  {booking.pickupLocation && (
                    <div className="flex items-start gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Địa điểm nhận xe</p>
                        <p className="text-sm text-gray-700">{booking.pickupLocation}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {booking.totalPrice.toLocaleString()} VNĐ
                      </p>
                      <p className="text-sm text-gray-600">
                        Đặt cọc: {booking.deposit.toLocaleString()} VNĐ
                      </p>
                    </div>

                    {booking.status === BookingStatus.PENDING && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/payment?orderCode=${booking.orderCode}`);
                        }}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm font-medium"
                      >
                        Thanh toán ngay
                      </button>
                    )}

                    {booking.status === BookingStatus.CONFIRMED && (
                      <div className="text-sm text-green-600 font-medium">
                        ✓ Đã thanh toán đặt cọc (30%)
                      </div>
                    )}

                    {booking.status === BookingStatus.IN_PROGRESS && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFinalPayment(booking.id);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2"
                      >
                        <DollarSign className="w-4 h-4" />
                        Thanh toán còn lại (70%)
                      </button>
                    )}

                    {booking.status === BookingStatus.COMPLETED && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBookingForReview(booking);
                        }}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm font-medium flex items-center gap-2"
                      >
                        <Star className="w-4 h-4" />
                        Đánh giá xe
                      </button>
                    )}
                  </div>

                  {booking.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Ghi chú:</span> {booking.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedBookingForReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">Đánh giá xe</h2>
              <button
                onClick={() => setSelectedBookingForReview(null)}
                className="text-gray-600 hover:text-gray-900 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900">
                  {selectedBookingForReview.carName}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedBookingForReview.carBrand} {selectedBookingForReview.carModel}
                </p>
              </div>
              <ReviewForm
                carId={selectedBookingForReview.carId}
                bookingId={selectedBookingForReview.id}
                userId={Number(localStorage.getItem("userId"))}
                onReviewCreated={() => {
                  setSelectedBookingForReview(null);
                  loadBookings();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
