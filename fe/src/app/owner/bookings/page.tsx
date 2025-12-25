"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ownerService } from "@/lib/services/ownerService";
import { Booking, BookingStatus, UserRole } from "@/types";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Clock, Car } from "lucide-react";

export default function OwnerBookingsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<BookingStatus | "ALL">("ALL");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/owner/bookings");
      return;
    }

    if (user && user.role !== UserRole.OWNER) {
      router.push("/");
      return;
    }

    loadBookings();
  }, [isAuthenticated, user]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await ownerService.getOwnerBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải danh sách đặt xe");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    if (!confirm("Bạn có chắc muốn duyệt đơn đặt xe này?")) return;

    try {
      await ownerService.approveBooking(id);
      loadBookings(); // Reload list
    } catch (err: any) {
      alert(err.response?.data?.message || "Không thể duyệt đơn");
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm("Bạn có chắc muốn từ chối đơn đặt xe này?")) return;

    try {
      await ownerService.rejectBooking(id);
      loadBookings(); // Reload list
    } catch (err: any) {
      alert(err.response?.data?.message || "Không thể từ chối đơn");
    }
  };

  const handleStart = async (id: number) => {
    if (!confirm("Xác nhận khách đã nhận xe?")) return;

    try {
      await ownerService.startBooking(id);
      loadBookings();
    } catch (err: any) {
      alert(err.response?.data?.message || "Không thể bắt đầu thuê");
    }
  };

  const handleComplete = async (id: number) => {
    if (!confirm("Xác nhận khách đã trả xe và thanh toán đủ?\n\nLưu ý: Bạn đang xác nhận đã nhận đủ tiền từ khách hàng.")) return;

    try {
      await ownerService.completeBooking(id);
      alert("Đã hoàn thành đơn thuê xe!");
      loadBookings();
    } catch (err: any) {
      alert(err.response?.data?.message || "Không thể hoàn thành đơn");
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    const badges = {
      [BookingStatus.PENDING]: "bg-yellow-100 text-yellow-800",
      [BookingStatus.CONFIRMED]: "bg-green-100 text-green-800",
      [BookingStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800",
      [BookingStatus.COMPLETED]: "bg-gray-100 text-gray-800",
      [BookingStatus.CANCELLED]: "bg-red-100 text-red-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: BookingStatus) => {
    const texts = {
      [BookingStatus.PENDING]: "Chờ duyệt",
      [BookingStatus.CONFIRMED]: "Đã duyệt",
      [BookingStatus.IN_PROGRESS]: "Đang thuê",
      [BookingStatus.COMPLETED]: "Hoàn thành",
      [BookingStatus.CANCELLED]: "Đã hủy",
    };
    return texts[status] || status;
  };

  const filteredBookings =
    filter === "ALL"
      ? bookings
      : bookings.filter((b) => b.status === filter);

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Car className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý đơn đặt xe
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
                  ? "bg-blue-600 text-white"
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
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              Không có đơn đặt xe nào
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {booking.carName} - {booking.carLicensePlate}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Mã đơn: {booking.bookingCode}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                        booking.status
                      )}`}
                    >
                      {getStatusText(booking.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Khách hàng:</span>{" "}
                        {booking.userFullName}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">SĐT:</span>{" "}
                        {booking.userPhoneNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span>{" "}
                        {booking.userEmail}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Từ:</span>{" "}
                        {new Date(booking.startDate).toLocaleDateString("vi-VN")}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Đến:</span>{" "}
                        {new Date(booking.endDate).toLocaleDateString("vi-VN")}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Số ngày:</span>{" "}
                        {booking.totalDays} ngày
                      </p>
                    </div>
                  </div>

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
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(booking.id)}
                          className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Duyệt
                        </button>
                        <button
                          onClick={() => handleReject(booking.id)}
                          className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                          <XCircle className="w-4 h-4" />
                          Từ chối
                        </button>
                      </div>
                    )}

                    {booking.status === BookingStatus.CONFIRMED && (
                      <button
                        onClick={() => handleStart(booking.id)}
                        className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        <Car className="w-4 h-4" />
                        Bắt đầu thuê (Khách nhận xe)
                      </button>
                    )}

                    {booking.status === BookingStatus.IN_PROGRESS && (
                      <button
                        onClick={() => handleComplete(booking.id)}
                        className="flex items-center gap-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Hoàn thành (Khách trả xe)
                      </button>
                    )}

                    {booking.status === BookingStatus.COMPLETED && (
                      <div className="text-sm text-green-600 font-medium">
                        ✓ Đã hoàn thành
                      </div>
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
    </div>
  );
}
