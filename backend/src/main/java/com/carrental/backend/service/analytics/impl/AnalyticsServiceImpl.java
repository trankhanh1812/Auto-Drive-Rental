package com.carrental.backend.service.analytics.impl;

import com.carrental.backend.dto.analytics.RevenueAnalyticsDTO;
import com.carrental.backend.entity.Booking;
import com.carrental.backend.entity.Car;
import com.carrental.backend.entity.Review;
import com.carrental.backend.entity.User;
import com.carrental.backend.enums.BookingStatus;
import com.carrental.backend.repository.booking.BookingRepository;
import com.carrental.backend.repository.car.CarRepository;
import com.carrental.backend.repository.review.ReviewRepository;
import com.carrental.backend.service.analytics.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;
    private final ReviewRepository reviewRepository;

    @Override
    public RevenueAnalyticsDTO getOwnerAnalytics(Long ownerId, Integer year) {
        if (year == null) {
            year = LocalDateTime.now().getYear();
        }

        List<Car> ownerCars = carRepository.findByCreatedByUserId(ownerId);
        List<Long> carIds = ownerCars.stream().map(Car::getId).collect(Collectors.toList());

        if (carIds.isEmpty()) {
            return createEmptyAnalytics();
        }

        // Get bookings for owner's cars
        List<Booking> allBookings = bookingRepository.findByCarIdIn(carIds);
        
        // Filter bookings by year
        LocalDateTime startOfYear = LocalDateTime.of(year, 1, 1, 0, 0);
        LocalDateTime endOfYear = LocalDateTime.of(year, 12, 31, 23, 59);
        
        List<Booking> yearBookings = allBookings.stream()
                .filter(b -> b.getCreatedAt().isAfter(startOfYear) && b.getCreatedAt().isBefore(endOfYear))
                .collect(Collectors.toList());

        // Get reviews for owner's cars
        List<Review> allReviews = reviewRepository.findByCarIdIn(carIds);

        return RevenueAnalyticsDTO.builder()
                .overview(calculateOverview(yearBookings))
                .monthlyRevenue(calculateMonthlyRevenue(yearBookings, year))
                .bookingTrends(calculateBookingTrends(yearBookings, year))
                .ratingAnalysis(calculateRatingAnalysis(allReviews, year))
                .customerDemographics(calculateCustomerDemographics(allBookings))
                .build();
    }

    private RevenueAnalyticsDTO.RevenueOverview calculateOverview(List<Booking> bookings) {
        BigDecimal totalRevenue = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime startOfLastMonth = startOfMonth.minusMonths(1);

        BigDecimal thisMonthRevenue = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .filter(b -> b.getCreatedAt().isAfter(startOfMonth))
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal lastMonthRevenue = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .filter(b -> b.getCreatedAt().isAfter(startOfLastMonth) && b.getCreatedAt().isBefore(startOfMonth))
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Double revenueGrowth = 0.0;
        if (lastMonthRevenue.compareTo(BigDecimal.ZERO) > 0) {
            revenueGrowth = thisMonthRevenue.subtract(lastMonthRevenue)
                    .divide(lastMonthRevenue, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }

        Double avgBookingValue = 0.0;
        if (!bookings.isEmpty()) {
            avgBookingValue = totalRevenue.divide(
                    BigDecimal.valueOf(bookings.size()), 
                    2, 
                    RoundingMode.HALF_UP
            ).doubleValue();
        }

        return RevenueAnalyticsDTO.RevenueOverview.builder()
                .totalRevenue(totalRevenue)
                .thisMonthRevenue(thisMonthRevenue)
                .lastMonthRevenue(lastMonthRevenue)
                .revenueGrowth(revenueGrowth)
                .totalBookings(bookings.size())
                .averageBookingValue(avgBookingValue)
                .build();
    }

    private List<RevenueAnalyticsDTO.MonthlyRevenue> calculateMonthlyRevenue(List<Booking> bookings, Integer year) {
        List<RevenueAnalyticsDTO.MonthlyRevenue> monthlyData = new ArrayList<>();
        
        for (int month = 1; month <= 12; month++) {
            int finalMonth = month;
            List<Booking> monthBookings = bookings.stream()
                    .filter(b -> b.getCreatedAt().getMonthValue() == finalMonth)
                    .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                    .collect(Collectors.toList());

            BigDecimal revenue = monthBookings.stream()
                    .map(Booking::getTotalPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            monthlyData.add(RevenueAnalyticsDTO.MonthlyRevenue.builder()
                    .month(String.format("%02d", month))
                    .year(year)
                    .revenue(revenue)
                    .bookingCount(monthBookings.size())
                    .build());
        }

        return monthlyData;
    }

    private List<RevenueAnalyticsDTO.BookingTrend> calculateBookingTrends(List<Booking> bookings, Integer year) {
        List<RevenueAnalyticsDTO.BookingTrend> trends = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {
            int finalMonth = month;
            List<Booking> monthBookings = bookings.stream()
                    .filter(b -> b.getCreatedAt().getMonthValue() == finalMonth)
                    .collect(Collectors.toList());

            int confirmed = (int) monthBookings.stream()
                    .filter(b -> b.getStatus() == BookingStatus.CONFIRMED).count();
            int cancelled = (int) monthBookings.stream()
                    .filter(b -> b.getStatus() == BookingStatus.CANCELLED).count();
            int completed = (int) monthBookings.stream()
                    .filter(b -> b.getStatus() == BookingStatus.COMPLETED).count();

            trends.add(RevenueAnalyticsDTO.BookingTrend.builder()
                    .period(String.format("%d-%02d", year, month))
                    .totalBookings(monthBookings.size())
                    .confirmedBookings(confirmed)
                    .cancelledBookings(cancelled)
                    .completedBookings(completed)
                    .build());
        }

        return trends;
    }

    private RevenueAnalyticsDTO.RatingAnalysis calculateRatingAnalysis(List<Review> reviews, Integer year) {
        LocalDateTime startOfYear = LocalDateTime.of(year, 1, 1, 0, 0);
        LocalDateTime endOfYear = LocalDateTime.of(year, 12, 31, 23, 59);

        List<Review> yearReviews = reviews.stream()
                .filter(r -> r.getCreatedAt().isAfter(startOfYear) && r.getCreatedAt().isBefore(endOfYear))
                .collect(Collectors.toList());

        Double avgRating = yearReviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        Map<Integer, Integer> distribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            int rating = i;
            int count = (int) yearReviews.stream()
                    .filter(r -> r.getRating() == rating)
                    .count();
            distribution.put(i, count);
        }

        List<RevenueAnalyticsDTO.RatingByMonth> ratingTrends = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            int finalMonth = month;
            List<Review> monthReviews = yearReviews.stream()
                    .filter(r -> r.getCreatedAt().getMonthValue() == finalMonth)
                    .collect(Collectors.toList());

            Double monthAvg = monthReviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);

            ratingTrends.add(RevenueAnalyticsDTO.RatingByMonth.builder()
                    .month(String.format("%02d", month))
                    .averageRating(monthAvg)
                    .reviewCount(monthReviews.size())
                    .build());
        }

        return RevenueAnalyticsDTO.RatingAnalysis.builder()
                .averageRating(avgRating)
                .ratingDistribution(distribution)
                .ratingTrends(ratingTrends)
                .build();
    }

    private RevenueAnalyticsDTO.CustomerDemographics calculateCustomerDemographics(List<Booking> bookings) {
        // Get unique customers
        Set<Long> uniqueCustomers = bookings.stream()
                .map(b -> b.getUser().getId())
                .collect(Collectors.toSet());

        // Count bookings per customer
        Map<Long, Long> customerBookingCount = bookings.stream()
                .collect(Collectors.groupingBy(
                        b -> b.getUser().getId(),
                        Collectors.counting()
                ));

        // Returning customers (>1 booking)
        int returningCustomers = (int) customerBookingCount.values().stream()
                .filter(count -> count > 1)
                .count();

        // Customers by region (from their address or pickup location)
        Map<String, Integer> customersByRegion = bookings.stream()
                .collect(Collectors.groupingBy(
                        b -> {
                            String location = b.getPickupLocation();
                            if (location != null && !location.isEmpty()) {
                                // Extract city from address (simple approach)
                                String[] parts = location.split(",");
                                return parts.length > 0 ? parts[parts.length - 1].trim() : "Unknown";
                            }
                            return "Unknown";
                        },
                        Collectors.collectingAndThen(Collectors.counting(), Long::intValue)
                ));

        // Top customers
        List<RevenueAnalyticsDTO.TopCustomer> topCustomers = customerBookingCount.entrySet().stream()
                .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                .limit(10)
                .map(entry -> {
                    Long userId = entry.getKey();
                    List<Booking> userBookings = bookings.stream()
                            .filter(b -> b.getUser().getId().equals(userId))
                            .collect(Collectors.toList());
                    
                    User user = userBookings.get(0).getUser();
                    BigDecimal totalSpent = userBookings.stream()
                            .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                            .map(Booking::getTotalPrice)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    return RevenueAnalyticsDTO.TopCustomer.builder()
                            .userId(userId)
                            .fullName(user.getFullName())
                            .bookingCount(entry.getValue().intValue())
                            .totalSpent(totalSpent)
                            .build();
                })
                .collect(Collectors.toList());

        return RevenueAnalyticsDTO.CustomerDemographics.builder()
                .totalUniqueCustomers(uniqueCustomers.size())
                .returningCustomers(returningCustomers)
                .newCustomers(uniqueCustomers.size() - returningCustomers)
                .customersByRegion(customersByRegion)
                .topCustomers(topCustomers)
                .build();
    }

    private RevenueAnalyticsDTO createEmptyAnalytics() {
        return RevenueAnalyticsDTO.builder()
                .overview(RevenueAnalyticsDTO.RevenueOverview.builder()
                        .totalRevenue(BigDecimal.ZERO)
                        .thisMonthRevenue(BigDecimal.ZERO)
                        .lastMonthRevenue(BigDecimal.ZERO)
                        .revenueGrowth(0.0)
                        .totalBookings(0)
                        .averageBookingValue(0.0)
                        .build())
                .monthlyRevenue(new ArrayList<>())
                .bookingTrends(new ArrayList<>())
                .ratingAnalysis(RevenueAnalyticsDTO.RatingAnalysis.builder()
                        .averageRating(0.0)
                        .ratingDistribution(new HashMap<>())
                        .ratingTrends(new ArrayList<>())
                        .build())
                .customerDemographics(RevenueAnalyticsDTO.CustomerDemographics.builder()
                        .totalUniqueCustomers(0)
                        .returningCustomers(0)
                        .newCustomers(0)
                        .customersByRegion(new HashMap<>())
                        .topCustomers(new ArrayList<>())
                        .build())
                .build();
    }
}
