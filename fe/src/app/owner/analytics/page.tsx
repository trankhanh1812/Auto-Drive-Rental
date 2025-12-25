"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types";
import { analyticsService, RevenueAnalytics } from "@/lib/services/analyticsService";
import {
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<RevenueAnalytics | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState<"revenue" | "bookings" | "ratings" | "customers">("revenue");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/owner/analytics");
      return;
    }

    if (user && user.role !== UserRole.OWNER) {
      router.push("/");
      return;
    }

    loadAnalytics();
  }, [isAuthenticated, user, selectedYear]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getOwnerAnalytics(selectedYear);
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const { overview, monthlyRevenue, bookingTrends, ratingAnalysis, customerDemographics } = analytics;

  // Prepare chart data
  const revenueChartData = monthlyRevenue.map((item) => ({
    name: `Tháng ${item.month}`,
    revenue: item.revenue,
    bookings: item.bookingCount,
  }));

  const bookingChartData = bookingTrends.map((item) => ({
    name: item.period.split("-")[1] ? `T${item.period.split("-")[1]}` : item.period,
    Hoàn_thành: item.completedBookings,
    Đã_xác_nhận: item.confirmedBookings,
    Đã_hủy: item.cancelledBookings,
  }));

  const ratingDistributionData = Object.entries(ratingAnalysis.ratingDistribution).map(
    ([rating, count]) => ({
      name: `${rating} sao`,
      value: count,
    })
  );

  const regionData = Object.entries(customerDemographics.customersByRegion)
    .map(([region, count]) => ({
      name: region,
      value: count,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const COLORS = ["#8b5cf6", "#6366f1", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

  const tabs = [
    { id: "revenue" as const, name: "Doanh thu", icon: DollarSign },
    { id: "bookings" as const, name: "Booking Trend", icon: Calendar },
    { id: "ratings" as const, name: "Đánh giá", icon: Star },
    { id: "customers" as const, name: "Khách hàng", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              Thống kê & Phân tích
            </h1>
            <p className="text-gray-600 mt-2">Báo cáo chi tiết về doanh thu và hoạt động kinh doanh</p>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          >
            {[2024, 2025, 2026].map((year) => (
              <option key={year} value={year}>
                Năm {year}
              </option>
            ))}
          </select>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-green-500" />
              {overview.revenueGrowth > 0 ? (
                <ArrowUpRight className="w-5 h-5 text-green-500" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-red-500" />
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">Tổng doanh thu</p>
            <p className="text-2xl font-bold text-gray-900">
              {overview.totalRevenue.toLocaleString("vi-VN")}đ
            </p>
            <p className={`text-sm mt-2 ${overview.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
              {overview.revenueGrowth > 0 ? "+" : ""}
              {overview.revenueGrowth.toFixed(1)}% so với tháng trước
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <Calendar className="w-8 h-8 text-blue-500 mb-4" />
            <p className="text-sm text-gray-600 mb-1">Tổng booking</p>
            <p className="text-2xl font-bold text-gray-900">{overview.totalBookings}</p>
            <p className="text-sm text-gray-700 mt-2 font-medium">Trong năm {selectedYear}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <Star className="w-8 h-8 text-yellow-500 mb-4" />
            <p className="text-sm text-gray-600 mb-1">Đánh giá TB</p>
            <p className="text-2xl font-bold text-gray-900">
              {ratingAnalysis.averageRating.toFixed(1)}/5.0
            </p>
            <p className="text-sm text-gray-700 mt-2 font-medium">Từ tất cả đánh giá</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <Users className="w-8 h-8 text-purple-500 mb-4" />
            <p className="text-sm text-gray-600 mb-1">Khách hàng</p>
            <p className="text-2xl font-bold text-gray-900">
              {customerDemographics.totalUniqueCustomers}
            </p>
            <p className="text-sm text-gray-700 mt-2 font-medium">
              {customerDemographics.returningCustomers} khách quay lại
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-4 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Revenue Tab */}
            {activeTab === "revenue" && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Doanh thu theo tháng - Năm {selectedYear}
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: any) => {
                        if (typeof value === "number") {
                          return value.toLocaleString("vi-VN") + "đ";
                        }
                        return value;
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Doanh thu"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>

                <div className="mt-8 grid md:grid-cols-3 gap-4">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-purple-600 font-medium">Tháng này</p>
                    <p className="text-2xl font-bold text-purple-900 mt-1">
                      {overview.thisMonthRevenue.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600 font-medium">Tháng trước</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">
                      {overview.lastMonthRevenue.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-600 font-medium">Trung bình/Booking</p>
                    <p className="text-2xl font-bold text-green-900 mt-1">
                      {overview.averageBookingValue.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Booking Trends Tab */}
            {activeTab === "bookings" && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Xu hướng đặt xe - Năm {selectedYear}
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={bookingChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Hoàn_thành" fill="#10b981" />
                    <Bar dataKey="Đã_xác_nhận" fill="#3b82f6" />
                    <Bar dataKey="Đã_hủy" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Ratings Tab */}
            {activeTab === "ratings" && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Phân tích đánh giá</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Phân bố đánh giá</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={ratingDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {ratingDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Xu hướng đánh giá theo tháng
                    </h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={ratingAnalysis.ratingTrends.map((item) => ({
                          name: `T${item.month}`,
                          rating: item.averageRating,
                          reviews: item.reviewCount,
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 5]} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="rating"
                          name="Đánh giá TB"
                          stroke="#f59e0b"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Customers Tab */}
            {activeTab === "customers" && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Phân tích khách hàng</h3>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Khách hàng theo khu vực</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={regionData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Thống kê khách hàng</h4>
                    <div className="space-y-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-blue-600 font-medium">Tổng khách hàng</p>
                        <p className="text-3xl font-bold text-blue-900 mt-1">
                          {customerDemographics.totalUniqueCustomers}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm text-green-600 font-medium">Khách quay lại</p>
                        <p className="text-3xl font-bold text-green-900 mt-1">
                          {customerDemographics.returningCustomers}
                          <span className="text-lg ml-2">
                            (
                            {(
                              (customerDemographics.returningCustomers /
                                customerDemographics.totalUniqueCustomers) *
                              100
                            ).toFixed(1)}
                            %)
                          </span>
                        </p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-sm text-purple-600 font-medium">Khách mới</p>
                        <p className="text-3xl font-bold text-purple-900 mt-1">
                          {customerDemographics.newCustomers}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Customers */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Top 10 khách hàng</h4>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                            #
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                            Khách hàng
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                            Số booking
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                            Tổng chi tiêu
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {customerDemographics.topCustomers.map((customer, index) => (
                          <tr key={customer.userId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {customer.fullName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                              {customer.bookingCount} lần
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                              {customer.totalSpent.toLocaleString("vi-VN")}đ
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
