package com.carrental.backend.service.booking;

import com.carrental.backend.dto.booking.BookingDTO;
import com.carrental.backend.dto.booking.BookingRequestDTO;

import java.util.List;

public interface BookingService {
    //BookingDTO createBooking(Long userId, BookingRequestDTO request);
    BookingDTO createBooking(BookingRequestDTO request);
    BookingDTO getBookingById(Long bookingId);
    BookingDTO getBookingByOrderCode(String orderCode);
    List<BookingDTO> getUserBookings();
    List<BookingDTO> getOwnerBookings(Long ownerId);
    BookingDTO approveBooking(Long bookingId);
    BookingDTO rejectBooking(Long bookingId);
    BookingDTO startBooking(Long bookingId);
    BookingDTO completeBooking(Long bookingId);
//    BookingDTO startTrip(Long bookingId);
//    BookingDTO endTrip(Long bookingId);
//    BookingDTO confirmBooking(Long bookingId);
//    BookingDTO completeTrip(Long bookingId);
//    BookingDTO cancelBooking(Long bookingId);
//    BookingDTO getBookingById(Long bookingId);
//    BookingDTO getBookingByCode(String bookingCode);
//    List<BookingDTO> getUserBookings(Long userId);
//    List<BookingDTO> getAllBookings();
}
