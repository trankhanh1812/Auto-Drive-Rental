import api from '../api';

export interface MonthlyRevenue {
  month: string;
  year: number;
  revenue: number;
  bookingCount: number;
}

export interface BookingTrend {
  period: string;
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  completedBookings: number;
}

export interface RatingByMonth {
  month: string;
  averageRating: number;
  reviewCount: number;
}

export interface RatingAnalysis {
  averageRating: number;
  ratingDistribution: Record<number, number>;
  ratingTrends: RatingByMonth[];
}

export interface TopCustomer {
  userId: number;
  fullName: string;
  bookingCount: number;
  totalSpent: number;
}

export interface CustomerDemographics {
  totalUniqueCustomers: number;
  returningCustomers: number;
  newCustomers: number;
  customersByRegion: Record<string, number>;
  topCustomers: TopCustomer[];
}

export interface RevenueOverview {
  totalRevenue: number;
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  revenueGrowth: number;
  totalBookings: number;
  averageBookingValue: number;
}

export interface RevenueAnalytics {
  overview: RevenueOverview;
  monthlyRevenue: MonthlyRevenue[];
  bookingTrends: BookingTrend[];
  ratingAnalysis: RatingAnalysis;
  customerDemographics: CustomerDemographics;
}

export const analyticsService = {
  getOwnerAnalytics: async (year?: number): Promise<RevenueAnalytics> => {
    const params = year ? { year } : {};
    const response = await api.get('/owner/analytics', { params });
    return response.data.data;
  },
};
