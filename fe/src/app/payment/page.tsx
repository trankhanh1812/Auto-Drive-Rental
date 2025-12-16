"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { bookingService } from "@/lib/services/bookingService";
import { paymentService } from "@/lib/services/paymentService";
import { Booking, PaymentStatus } from "@/types";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  const bookingId = searchParams.get("bookingId");
  const orderCode = searchParams.get("orderCode");

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<string>(PaymentStatus.PENDING);
  const [error, setError] = useState("");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/payment");
      return;
    }

    if (!orderCode) {
      setError("Missing order code");
      setLoading(false);
      return;
    }

    loadBooking();
    loadPaymentInfo();
    startPaymentPolling();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated, orderCode]);

  const loadPaymentInfo = async () => {
    if (!orderCode) return;
    
    try {
      const payment = await paymentService.checkPaymentStatus(orderCode);
      setPaymentAmount(payment.amount);
      setPaymentStatus(payment.status);
    } catch (err) {
      console.error("Error loading payment info:", err);
    }
  };

  const loadBooking = async () => {
    try {
      setLoading(true);
      
      // If bookingId is provided, use it directly
      if (bookingId) {
        const data = await bookingService.getBookingById(Number(bookingId));
        setBooking(data);
      } else if (orderCode) {
        // Otherwise try to get booking by orderCode
        const data = await bookingService.getBookingByOrderCode(orderCode);
        setBooking(data);
      } else {
        setError("Missing booking information");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải thông tin đặt xe");
    } finally {
      setLoading(false);
    }
  };

  const startPaymentPolling = () => {
    if (!orderCode) return;

    intervalRef.current = setInterval(async () => {
      try {
        const payment = await paymentService.checkPaymentStatus(orderCode);
        setPaymentStatus(payment.status);
        setPaymentAmount(payment.amount);

        if (payment.status === PaymentStatus.COMPLETED) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          // Redirect to my bookings after 2 seconds
          setTimeout(() => {
            router.push("/bookings");
          }, 2000);
        } else if (payment.status === PaymentStatus.FAILED) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      } catch (err) {
        console.error("Error checking payment status:", err);
      }
    }, 5000); // Poll every 5 seconds
  };

  const getBankCode = (bankName: string | undefined): string => {
    if (!bankName) return "970422"; // Default Vietcombank
    
    const name = bankName.toUpperCase();
    
    // Common bank mappings
    const bankCodes: Record<string, string> = {
      "VIETCOMBANK": "970436",
      "VCB": "970436",
      "TECHCOMBANK": "970407",
      "TCB": "970407",
      "MBBANK": "970422",
      "MB": "970422",
      "VIETINBANK": "970415",
      "VIB": "970441",
      "ACB": "970416",
      "SACOMBANK": "970403",
      "STB": "970403",
      "BIDV": "970418",
      "AGRIBANK": "970405",
      "VPBank": "970432",
      "TPBank": "970423",
      "SHB": "970443",
      "SEABANK": "970440",
      "HDBANK": "970437",
      "OCB": "970448",
      "MSB": "970426",
      "VIETBANK": "970433",
      "LPBank": "970449",
      "KienLongBank": "970452",
      "VietCapitalBank": "970454",
    };

    // Try to find matching bank code
    for (const [key, code] of Object.entries(bankCodes)) {
      if (name.includes(key)) {
        return code;
      }
    }

    return "970422"; // Default to MBBank
  };

  const getQRCodeUrl = () => {
    if (!booking) return "";

    const bankCode = getBankCode(booking.carOwnerBankName);
    const accountNo = booking.carOwnerBankAccountNumber || "";
    // Use paymentAmount if available, otherwise fall back to deposit
    const amount = paymentAmount > 0 ? paymentAmount : booking.deposit || 0;
    const description = orderCode || "";

    return `https://img.vietqr.io/image/${bankCode}-${accountNo}-compact.png?amount=${amount}&addInfo=${description}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Đang tải thông tin thanh toán...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lỗi</h2>
          <p className="text-gray-600">{error || "Không tìm thấy thông tin đặt xe"}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Check if owner has bank info
  if (!booking.carOwnerBankName || !booking.carOwnerBankAccountNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <XCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Chưa có thông tin thanh toán
          </h2>
          <p className="text-gray-600 mb-4">
            Chủ xe chưa cập nhật thông tin tài khoản ngân hàng. Vui lòng liên hệ với chủ xe hoặc quay lại sau.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700">
              <strong>Chủ xe:</strong> {booking.carOwnerName || "N/A"}
            </p>
            <p className="text-sm text-gray-700">
              <strong>SĐT:</strong> {booking.carOwnerPhone || "N/A"}
            </p>
          </div>
          <button
            onClick={() => router.push("/bookings")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Xem đơn đặt xe
          </button>
        </div>
      </div>
    );
  }

  if (paymentStatus === PaymentStatus.COMPLETED) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Thanh toán thành công!
          </h2>
          <p className="text-gray-600">Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thanh toán đặt cọc
          </h1>
          <p className="text-gray-600">
            Đặt xe: <span className="font-semibold text-blue-600">{booking.carName}</span>
          </p>
        </div>

        <div className="flex flex-col items-center space-y-6">
          {/* QR Code */}
          <div className="w-full flex justify-center">
            <img
              src={getQRCodeUrl()}
              alt="QR Code"
              className="w-64 h-64 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>

          {/* Payment Info */}
          <div className="w-full text-center text-gray-800">
            <p className="text-xl font-bold mb-2">
              Số tiền: {(paymentAmount > 0 ? paymentAmount : booking.deposit).toLocaleString()} VNĐ
            </p>
            <p className="text-lg font-medium mb-1">
              Mã đơn hàng: {orderCode}
            </p>
            <p className="text-sm text-gray-600">
              Ngân hàng: {booking.carOwnerBankName}
            </p>
            <p className="text-sm text-gray-600">
              STK: {booking.carOwnerBankAccountNumber}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Chủ TK: {booking.carOwnerBankAccountName}
            </p>
            <p className="text-sm text-gray-500 mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              ⚠️ Vui lòng chuyển khoản đúng số tiền và ghi đúng mã đơn hàng trong nội dung chuyển khoản
            </p>
          </div>

          {/* Booking Details */}
          <div className="w-full bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Thông tin đặt xe</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <span className="font-medium">Xe:</span> {booking.carBrand}{" "}
                {booking.carModel}
              </p>
              <p>
                <span className="font-medium">Biển số:</span> {booking.carLicensePlate}
              </p>
              <p>
                <span className="font-medium">Từ:</span>{" "}
                {new Date(booking.startDate).toLocaleDateString("vi-VN")}
              </p>
              <p>
                <span className="font-medium">Đến:</span>{" "}
                {new Date(booking.endDate).toLocaleDateString("vi-VN")}
              </p>
              <p>
                <span className="font-medium">Số ngày:</span> {booking.totalDays} ngày
              </p>
              <p>
                <span className="font-medium">Tổng tiền:</span>{" "}
                {booking.totalPrice.toLocaleString()} VNĐ
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="w-full text-center">
            <div className="flex items-center justify-center gap-2 text-orange-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Đang chờ thanh toán...</span>
            </div>
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => router.push("/bookings")}
            className="w-full py-3 text-lg font-semibold border border-blue-500 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            Xem đơn đặt xe của tôi
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
