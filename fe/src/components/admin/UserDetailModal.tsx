'use client';

import { User, UserRole } from '@/types';
import { X, User as UserIcon, Mail, Phone, MapPin, CreditCard, Calendar, Shield, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface UserDetailModalProps {
  user: User;
  onClose: () => void;
}

export default function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  const [showAllDetails, setShowAllDetails] = useState(false);

  const getRoleText = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return 'Quản trị viên';
      case UserRole.OWNER: return 'Chủ xe';
      case UserRole.USER: return 'Người dùng';
      default: return role;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return 'bg-red-100 text-red-800';
      case UserRole.OWNER: return 'bg-blue-100 text-blue-800';
      case UserRole.USER: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Chi tiết người dùng</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Picture & Basic Info */}
          <div className="flex items-start gap-6 pb-6 border-b">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              {user.profilePicture ? (
                <Image 
                  src={user.profilePicture} 
                  alt={user.fullName}
                  width={96}
                  height={96}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-12 h-12 text-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-gray-900">{user.fullName}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                  {getRoleText(user.role)}
                </span>
              </div>
              {user.username && (
                <p className="text-gray-600 mb-1">@{user.username}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.status === 'ACTIVE' ? 'Hoạt động' : 'Bị cấm'}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              Thông tin liên hệ
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-gray-900 font-medium break-all">{user.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                  <p className="text-gray-900 font-medium">{user.phoneNumber || 'Chưa cập nhật'}</p>
                </div>
              </div>
              {user.address && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg md:col-span-2">
                  <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Địa chỉ</p>
                    <p className="text-gray-900 font-medium">{user.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Driving License */}
          {user.drivingLicenseImage && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Giấy phép lái xe</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <Image
                  src={user.drivingLicenseImage}
                  alt="Giấy phép lái xe"
                  width={400}
                  height={250}
                  className="rounded-lg border border-gray-300 w-full max-w-md mx-auto object-cover"
                />
              </div>
            </div>
          )}

          {/* Bank Information - Only for OWNER */}
          {user.role === UserRole.OWNER && (user.bankName || user.bankAccountNumber || user.bankAccountName) && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                Thông tin ngân hàng
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {user.bankName && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Ngân hàng</p>
                      <p className="text-gray-900 font-medium">{user.bankName}</p>
                    </div>
                  </div>
                )}
                {user.bankAccountNumber && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Số tài khoản</p>
                      <p className="text-gray-900 font-medium font-mono">{user.bankAccountNumber}</p>
                    </div>
                  </div>
                )}
                {user.bankAccountName && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Tên tài khoản</p>
                      <p className="text-gray-900 font-medium">{user.bankAccountName}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Advanced Details Section */}
        {!showAllDetails && (
          <div className="border-t pt-4">
            <button
              onClick={() => setShowAllDetails(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition font-medium"
            >
              <ExternalLink className="w-5 h-5" />
              Xem tất cả thông tin chi tiết
            </button>
          </div>
        )}

        {/* All Details - Extended View */}
        {showAllDetails && (
          <div className="border-t pt-6 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Thông tin đầy đủ</h4>
              <button
                onClick={() => setShowAllDetails(false)}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Thu gọn
              </button>
            </div>

            {/* Account Details */}
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <h5 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Thông tin tài khoản</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">User ID</p>
                  <p className="text-gray-900 font-mono">#{user.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Username</p>
                  <p className="text-gray-900 font-medium">{user.username || 'Chưa có'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Trạng thái</p>
                  <p className="text-gray-900 font-medium">{user.status || 'ACTIVE'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Vai trò</p>
                  <p className="text-gray-900 font-medium">{getRoleText(user.role)}</p>
                </div>
              </div>
            </div>

            {/* Driving License Info */}
            {user.drivingLicense && (
              <div className="bg-green-50 rounded-lg p-4 space-y-3">
                <h5 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Giấy phép lái xe</h5>
                <div className="text-sm">
                  <p className="text-gray-500">Số giấy phép</p>
                  <p className="text-gray-900 font-mono text-lg">{user.drivingLicense}</p>
                </div>
              </div>
            )}

            {/* Complete Contact Info */}
            <div className="bg-purple-50 rounded-lg p-4 space-y-3">
              <h5 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Liên hệ đầy đủ</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="text-gray-900 font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Số điện thoại:</span>
                  <span className="text-gray-900 font-medium">{user.phoneNumber || 'Chưa cập nhật'}</span>
                </div>
                {user.address && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Địa chỉ:</span>
                    <span className="text-gray-900 font-medium text-right max-w-xs">{user.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Banking Details - Full View */}
            {user.role === UserRole.OWNER && (user.bankName || user.bankAccountNumber || user.bankAccountName) && (
              <div className="bg-yellow-50 rounded-lg p-4 space-y-3">
                <h5 className="font-semibold text-gray-900 text-sm uppercase tracking-wide flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Thông tin thanh toán
                </h5>
                <div className="space-y-2 text-sm">
                  {user.bankName && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ngân hàng:</span>
                      <span className="text-gray-900 font-medium">{user.bankName}</span>
                    </div>
                  )}
                  {user.bankAccountNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Số tài khoản:</span>
                      <span className="text-gray-900 font-mono font-medium">{user.bankAccountNumber}</span>
                    </div>
                  )}
                  {user.bankAccountName && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tên tài khoản:</span>
                      <span className="text-gray-900 font-medium">{user.bankAccountName}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h5 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Dữ liệu hệ thống</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày tạo:</span>
                  <span className="text-gray-900 font-medium">
                    {new Date(user.createdAt).toLocaleString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                {user.profilePicture && (
                  <div className="flex justify-between items-start">
                    <span className="text-gray-500">URL ảnh đại diện:</span>
                    <a 
                      href={user.profilePicture} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-xs break-all max-w-xs text-right"
                    >
                      {user.profilePicture.substring(0, 50)}...
                    </a>
                  </div>
                )}
                {user.drivingLicenseImage && (
                  <div className="flex justify-between items-start">
                    <span className="text-gray-500">URL giấy phép:</span>
                    <a 
                      href={user.drivingLicenseImage} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-xs break-all max-w-xs text-right"
                    >
                      {user.drivingLicenseImage.substring(0, 50)}...
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="w-full md:w-auto px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
