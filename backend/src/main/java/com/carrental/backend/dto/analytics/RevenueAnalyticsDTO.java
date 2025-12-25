package com.carrental.backend.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueAnalyticsDTO {
    private List<MonthlyRevenue> monthlyRevenue;
    private List<BookingTrend> bookingTrends;
    private RatingAnalysis ratingAnalysis;
    private CustomerDemographics customerDemographics;
    private RevenueOverview overview;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyRevenue {
        private String month;
        private Integer year;
        private BigDecimal revenue;
        private Integer bookingCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookingTrend {
        private String period; // "2024-01", "2024-02", etc
        private Integer totalBookings;
        private Integer confirmedBookings;
        private Integer cancelledBookings;
        private Integer completedBookings;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RatingAnalysis {
        private Double averageRating;
        private Map<Integer, Integer> ratingDistribution; // rating -> count
        private List<RatingByMonth> ratingTrends;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RatingByMonth {
        private String month;
        private Double averageRating;
        private Integer reviewCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerDemographics {
        private Map<String, Integer> customersByRegion; // location -> count
        private Integer totalUniqueCustomers;
        private Integer returningCustomers;
        private Integer newCustomers;
        private List<TopCustomer> topCustomers;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopCustomer {
        private Long userId;
        private String fullName;
        private Integer bookingCount;
        private BigDecimal totalSpent;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RevenueOverview {
        private BigDecimal totalRevenue;
        private BigDecimal thisMonthRevenue;
        private BigDecimal lastMonthRevenue;
        private Double revenueGrowth; // percentage
        private Integer totalBookings;
        private Double averageBookingValue;
    }
}
