package com.carrental.backend.controller;

import com.carrental.backend.dto.analytics.RevenueAnalyticsDTO;
import com.carrental.backend.dto.ApiResponse;
import com.carrental.backend.dto.booking.BookingDTO;
import com.carrental.backend.dto.car.CarDTO;
import com.carrental.backend.entity.User;
import com.carrental.backend.enums.BookingStatus;
import com.carrental.backend.enums.UserRole;
import com.carrental.backend.service.analytics.AnalyticsService;
import com.carrental.backend.service.booking.BookingService;
import com.carrental.backend.service.car.CarService;
import com.carrental.backend.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/owner")
@RequiredArgsConstructor
public class OwnerController {

    @Autowired
    private UserService userService;
    @Autowired
    private CarService carService;
    @Autowired
    private BookingService bookingService;
    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/cars")
    @PreAuthorize("hasAuthority('OWNER')")
    public ResponseEntity<ApiResponse<List<CarDTO>>> getOwnerCars() {
        User currentUser = userService.getCurrentUser();

        if (currentUser.getRole() != UserRole.OWNER) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied. Owner role required"));
        }
        List<CarDTO> cars = carService.getOwnerCars(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Owner cars found", cars));
    }
    @GetMapping("/cars/{id}")
    @PreAuthorize("hasAuthority('OWNER')")
    public ResponseEntity<ApiResponse<CarDTO>> getOwnerCarById(@PathVariable Long id) {
        User currentUser = userService.getCurrentUser();
        CarDTO car = carService.getCarById(id);

        // Verify the car belongs to the current owner
        if (!car.getIdUserCreated().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("You can only view your own cars."));
        }

        return ResponseEntity.ok(ApiResponse.success("Car details", car));
    }

    @PutMapping("/cars/{id}")
    @PreAuthorize("hasAuthority('OWNER')")
    public ResponseEntity<ApiResponse<CarDTO>> updateCar(
            @PathVariable Long id,
            @RequestBody com.carrental.backend.request.car.UpdateCarRequest request) {
        User currentUser = userService.getCurrentUser();
        CarDTO existingCar = carService.getCarById(id);

        // Verify the car belongs to the current owner
        if (!existingCar.getIdUserCreated().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("You can only update your own cars."));
        }

        CarDTO updatedCar = carService.updateCarByOwner(id, request);
        return ResponseEntity.ok(ApiResponse.success("Car updated successfully", updatedCar));
    }
    @GetMapping("/dashboard")
    @PreAuthorize("hasAuthority('OWNER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        User currentUser = userService.getCurrentUser();
        if(currentUser.getRole() != UserRole.OWNER) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Access denied. Owner role required"));
        }
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("totalCars", carService.countOwnerCars(currentUser.getId()));
        List<BookingDTO> ownerBookings = bookingService.getOwnerBookings(currentUser.getId());
        dashboard.put("totalBookings", ownerBookings.size());
//        dashboard.put("totalBookings", 0);
        double totalRevenue = ownerBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .mapToDouble(b -> b.getTotalPrice().doubleValue())
                .sum();
        dashboard.put("totalRevenue", totalRevenue);
//        dashboard.put("totalRevenue", 0.0);
        long pendingBookings = ownerBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.PENDING)
                .count();
        dashboard.put("pendingBookings", pendingBookings);
//        dashboard.put("pendingBookings", 0);
        long activeRentals = ownerBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.IN_PROGRESS)
                .count();
        dashboard.put("activeRentals", activeRentals);
        return ResponseEntity.ok(ApiResponse.success("Dashboard data", dashboard));
    }

    @GetMapping("/bookings")
    @PreAuthorize("hasAuthority('OWNER')")
    public ResponseEntity<ApiResponse<List<BookingDTO>>> getOwnerBookings() {
        User currentUser = userService.getCurrentUser();

        if (currentUser.getRole() != UserRole.OWNER) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Access denied. Owner role required"));
        }

        List<BookingDTO> bookings = bookingService.getOwnerBookings(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Owner bookings found", bookings));
    }

    @PutMapping("/bookings/{id}/approve")
    @PreAuthorize("hasAuthority('OWNER')")
    public ResponseEntity<ApiResponse<BookingDTO>> approveBooking(@PathVariable Long id) {
        BookingDTO booking = bookingService.approveBooking(id);
        return ResponseEntity.ok(ApiResponse.success("Booking approved successfully", booking));
    }

    @PutMapping("/booking/{id}/reject")
    @PreAuthorize("hasAuthority('OWNER')")
    public ResponseEntity<ApiResponse<BookingDTO>> rejectBooking(@PathVariable Long id) {
        BookingDTO booking = bookingService.rejectBooking(id);
        return ResponseEntity.ok(ApiResponse.success("Booking rejected successfully", booking));
    }
    @PutMapping("/bookings/{id}/start")
    @PreAuthorize("hasAuthority('OWNER')")
    public ResponseEntity<ApiResponse<BookingDTO>> startBooking(@PathVariable Long id) {
        BookingDTO booking = bookingService.startBooking(id);
        return ResponseEntity.ok(ApiResponse.success("Booking started - customer picked up car", booking));
    }

    @PutMapping("/bookings/{id}/complete")
    @PreAuthorize("hasAuthority('OWNER')")
    public ResponseEntity<ApiResponse<BookingDTO>> completeBooking(@PathVariable Long id) {
        BookingDTO booking = bookingService.completeBooking(id);
        return ResponseEntity.ok(ApiResponse.success("Booking completed - car returned", booking));
    }
    @GetMapping("/analytics")
    @PreAuthorize("hasAuthority('OWNER')")
    public ResponseEntity<ApiResponse<RevenueAnalyticsDTO>> getAnalytics(
            @RequestParam(required = false) Integer year
    ) {
        User currentUser = userService.getCurrentUser();
        
        if (currentUser.getRole() != UserRole.OWNER) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied. Owner role required"));
        }
        
        RevenueAnalyticsDTO analytics = analyticsService.getOwnerAnalytics(currentUser.getId(), year);
        return ResponseEntity.ok(ApiResponse.success("Analytics retrieved successfully", analytics));
    }}
