package com.carrental.backend.controller;

import com.carrental.backend.dto.ApiResponse;
import com.carrental.backend.dto.booking.BookingDTO;
import com.carrental.backend.dto.booking.BookingRequestDTO;
import com.carrental.backend.service.booking.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<BookingDTO>> createBooking(
            @Valid @RequestBody BookingRequestDTO request
            ) {
        BookingDTO bookingDTO = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Booking created successfully", bookingDTO));
    }

    @GetMapping("/my-bookings")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<BookingDTO>>> getMyBookings() {
        List<BookingDTO> bookings = bookingService.getUserBookings();
        return ResponseEntity.ok(ApiResponse.success("User bookings",bookings));
    }



    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<BookingDTO>> getBookingById(@PathVariable Long id) {
        BookingDTO booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.success("Booking details",booking));
    }

    @GetMapping("/order/{orderCode}")
    public ResponseEntity<ApiResponse<BookingDTO>> getBookingByOrderCode(@PathVariable String orderCode) {
        BookingDTO booking = bookingService.getBookingByOrderCode(orderCode);
        return ResponseEntity.ok(ApiResponse.success("Booking details",booking));
    }
//
//    @GetMapping("/code/{bookingCode}")
//    public ResponseEntity<ApiResponse<BookingDTO>> getBookingByCode(@PathVariable String bookingCode) {
//        BookingDTO booking = bookingService.getBookingByCode(bookingCode);
//        return ResponseEntity.ok(ApiResponse.success(booking));
//    }
//
//    @GetMapping("/user/{userId}")
//    public ResponseEntity<ApiResponse<List<BookingDTO>>> getUserBookings(@PathVariable Long userId) {
//        List<BookingDTO> bookings = bookingService.getUserBookings(userId);
//        return ResponseEntity.ok(ApiResponse.success(bookings));
//    }
//
//    @GetMapping
//    public ResponseEntity<ApiResponse<List<BookingDTO>>> getAllBookings() {
//        List<BookingDTO> bookings = bookingService.getAllBookings();
//        return ResponseEntity.ok(ApiResponse.success(bookings));
//    }
//
//    @PutMapping("/{id}/confirm")
//    public ResponseEntity<ApiResponse<BookingDTO>> confirmBooking(@PathVariable Long id) {
//        BookingDTO booking = bookingService.confirmBooking(id);
//        return ResponseEntity.ok(ApiResponse.success("Booking confirmed", booking));
//    }
//
//    @PutMapping("/{id}/start")
//    public ResponseEntity<ApiResponse<BookingDTO>> startTrip(@PathVariable Long id) {
//        BookingDTO booking = bookingService.startTrip(id);
//        return ResponseEntity.ok(ApiResponse.success("Trip started", booking));
//    }
//
//    @PutMapping("/{id}/complete")
//    public ResponseEntity<ApiResponse<BookingDTO>> completeTrip(@PathVariable Long id) {
//        BookingDTO booking = bookingService.completeTrip(id);
//        return ResponseEntity.ok(ApiResponse.success("Trip completed", booking));
//    }
//
//    @PutMapping("/{id}/cancel")
//    public ResponseEntity<ApiResponse<BookingDTO>> cancelBooking(@PathVariable Long id) {
//        BookingDTO booking = bookingService.cancelBooking(id);
//        return ResponseEntity.ok(ApiResponse.success("Booking cancelled", booking));
//    }
}
