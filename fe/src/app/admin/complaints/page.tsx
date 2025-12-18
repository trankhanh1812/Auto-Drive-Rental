"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function AdminComplaintsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/admin/complaints");
      return;
    }

    if (user && user.role !== UserRole.ADMIN) {
      alert("Bạn không có quyền truy cập");
      router.push("/");
    }
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-orange-600" />
            Xử lý khiếu nại
          </h1>
          <p className="text-gray-600 mt-2">
            Xem và giải quyết khiếu nại từ người dùng
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Chưa có khiếu nại nào</p>
          <p className="text-sm text-gray-600 mt-2">
            Chức năng khiếu nại đang được phát triển
          </p>
        </div>
      </div>
    </div>
  );
}
