"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { UserRole, User } from "@/types";
import { adminService } from "@/lib/services/adminService";
import {
  Users,
  Ban,
  UserCheck,
  Trash2,
  Shield,
  User as UserIcon,
  Eye,
} from "lucide-react";
import UserDetailModal from "@/components/admin/UserDetailModal";

export default function AdminUsersPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/admin/users");
      return;
    }

    if (user && user.role !== UserRole.ADMIN) {
      alert("Bạn không có quyền truy cập");
      router.push("/");
      return;
    }

    loadUsers();
  }, [isAuthenticated, user]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Không thể tải danh sách người dùng"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (userId: number) => {
    if (!confirm("Xác nhận cấm người dùng này?")) return;

    try {
      setProcessing(userId);
      await adminService.banUser(userId);
      alert("Đã cấm người dùng");
      loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || "Không thể cấm người dùng");
    } finally {
      setProcessing(null);
    }
  };

  const handleUnban = async (userId: number) => {
    if (!confirm("Xác nhận bỏ cấm người dùng này?")) return;

    try {
      setProcessing(userId);
      await adminService.unbanUser(userId);
      alert("Đã bỏ cấm người dùng");
      loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || "Không thể bỏ cấm người dùng");
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (userId: number) => {
    if (
      !confirm("XÁC NHẬN XÓA người dùng này? Hành động này KHÔNG THỂ HOÀN TÁC!")
    )
      return;

    try {
      setProcessing(userId);
      await adminService.deleteUser(userId);
      alert("Đã xóa người dùng");
      loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || "Không thể xóa người dùng");
    } finally {
      setProcessing(null);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const badges = {
      [UserRole.ADMIN]: "bg-purple-100 text-purple-800",
      [UserRole.OWNER]: "bg-blue-100 text-blue-800",
      [UserRole.USER]: "bg-gray-100 text-gray-800",
    };
    return badges[role] || "bg-gray-100 text-gray-800";
  };

  const getRoleText = (role: UserRole) => {
    const texts = {
      [UserRole.ADMIN]: "Admin",
      [UserRole.OWNER]: "Chủ xe",
      [UserRole.USER]: "Người dùng",
    };
    return texts[role] || role;
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-green-600" />
            Quản lý người dùng
          </h1>
          <p className="text-gray-600 mt-2">
            Tổng số: {users.length} người dùng
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900">
                    Người dùng
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900">
                    SĐT
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900">
                    Vai trò
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900">
                    Trạng thái
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {u.fullName}
                          </p>
                          <p className="text-sm text-gray-500">{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{u.email}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {u.phoneNumber || "Chưa cập nhật"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(u.role)}`}
                      >
                        {getRoleText(u.role)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          u.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {u.status === "ACTIVE" ? "Hoạt động" : "Bị cấm"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="p-2 bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {u.status === "ACTIVE" ? (
                          <button
                            onClick={() => handleBan(u.id)}
                            disabled={
                              processing === u.id || u.role === UserRole.ADMIN
                            }
                            className="p-2 bg-orange-100 text-orange-600 rounded hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            title="Cấm người dùng"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnban(u.id)}
                            disabled={processing === u.id}
                            className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200 disabled:opacity-50 transition"
                            title="Bỏ cấm"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(u.id)}
                          disabled={
                            processing === u.id || u.role === UserRole.ADMIN
                          }
                          className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          title="Xóa người dùng"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
