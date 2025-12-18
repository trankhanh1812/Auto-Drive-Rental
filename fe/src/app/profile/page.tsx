"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/lib/services/userService";
import { User, Camera, Upload, Save } from "lucide-react";
import { UserRole } from "@/types";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user: currentUser, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingLicense, setUploadingLicense] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profile, setProfile] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    email: "",
    drivingLicense: "",
    profilePicture: "",
    bankName: "",
    bankAccountNumber: "",
    bankAccountName: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/profile");
      return;
    }
    loadProfile();
  }, [isAuthenticated]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await userService.getCurrentProfile();
      setProfile({
        fullName: data.fullName || "",
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
        email: data.email || "",
        drivingLicense: data.drivingLicense || "",
        profilePicture: data.profilePicture || "",
        bankName: data.bankName || "",
        bankAccountNumber: data.bankAccountNumber || "",
        bankAccountName: data.bankAccountName || "",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải thông tin");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await userService.updateProfile(profile);
      setSuccess("Cập nhật thông tin thành công!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Kích thước file không được vượt quá 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn file ảnh");
      return;
    }

    setUploadingAvatar(true);
    setError("");
    setSuccess("");

    try {
      const fileUrl = await userService.uploadAvatar(file);
      // Reload profile to get updated data
      await loadProfile();
      setSuccess("Tải ảnh đại diện thành công!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Tải ảnh thất bại");
      console.error("Upload avatar error:", err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLicenseUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Kích thước file không được vượt quá 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn file ảnh");
      return;
    }

    setUploadingLicense(true);
    setError("");
    setSuccess("");

    try {
      const fileUrl = await userService.uploadDrivingLicense(file);
      // Reload profile to get updated data
      await loadProfile();
      setSuccess("Tải ảnh giấy phép lái xe thành công!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Tải ảnh thất bại");
      console.error("Upload license error:", err);
    } finally {
      setUploadingLicense(false);
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <User className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Thông Tin Cá Nhân
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          {/* Avatar Section */}
          <div className="mb-8 flex flex-col items-center">
            <div className="relative">
              {uploadingAvatar ? (
                <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center border-4 border-purple-200">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center border-4 border-purple-200">
                  <User className="w-16 h-16 text-purple-600" />
                </div>
              )}
              {!uploadingAvatar && (
                <label className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700 transition">
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {uploadingAvatar
                ? "Đang tải ảnh lên..."
                : "Nhấp vào biểu tượng camera để thay đổi ảnh đại diện"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={profile.fullName}
                  onChange={(e) =>
                    setProfile({ ...profile, fullName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={profile.phoneNumber}
                  onChange={(e) =>
                    setProfile({ ...profile, phoneNumber: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email không thể thay đổi
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ
              </label>
              <textarea
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 placeholder-gray-400"
                placeholder="Hướng Triển, Nhân Thắng, Bắc Ninh"
              />
            </div>

            {/* Bank Information - Only for OWNER role */}
            {currentUser?.role === UserRole.OWNER && (
              <>
                <div className="col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                    Thông tin ngân hàng (dành cho chủ xe)
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên ngân hàng
                  </label>
                  <input
                    type="text"
                    value={profile.bankName}
                    onChange={(e) =>
                      setProfile({ ...profile, bankName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 placeholder-gray-400"
                    placeholder="VD: MB Bank, Vietcombank..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số tài khoản
                  </label>
                  <input
                    type="text"
                    value={profile.bankAccountNumber}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        bankAccountNumber: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 placeholder-gray-400"
                    placeholder="VD: 00018122004"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên chủ tài khoản
                  </label>
                  <input
                    type="text"
                    value={profile.bankAccountName}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        bankAccountName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 placeholder-gray-400"
                    placeholder="VD: TRAN VAN KHANH"
                  />
                </div>
              </>
            )}

            {/* Driving License Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giấy phép lái xe
              </label>
              <div className="space-y-3">
                {uploadingLicense ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Đang tải ảnh lên...</p>
                  </div>
                ) : profile.drivingLicense ? (
                  <div className="space-y-3">
                    <div className="relative inline-block">
                      <img
                        src={profile.drivingLicense}
                        alt="Giấy phép lái xe"
                        className="max-w-md w-full rounded-lg border-2 border-gray-200 shadow-sm object-contain bg-gray-50"
                      />
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        ✓ Đã tải lên
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Nhấp vào nút bên dưới để thay đổi ảnh giấy phép lái xe
                    </p>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Chưa có ảnh giấy phép lái xe
                    </p>
                  </div>
                )}

                <label className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer transition w-fit font-medium">
                  <Upload className="w-5 h-5" />
                  <span>
                    {profile.drivingLicense
                      ? "Thay đổi ảnh"
                      : "Tải lên ảnh giấy phép lái xe"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLicenseUpload}
                    className="hidden"
                    disabled={uploadingLicense}
                  />
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
