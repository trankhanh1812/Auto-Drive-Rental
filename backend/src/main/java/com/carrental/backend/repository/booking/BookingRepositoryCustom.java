package com.carrental.backend.repository.booking;

import com.carrental.backend.entity.Booking;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepositoryCustom {

    List<Booking> findByUserId( Long userId);

    List<Booking> findActiveBookingsByCar( Long carId);

    Boolean isCarBookedInPeriod(Long carId,
                                 LocalDateTime startDate,
                                 LocalDateTime endDate);


    List<Booking> findBookingsByDateRange(LocalDateTime startDate,
                                           LocalDateTime endDate);

    Long countByUserId(Long userId);

    List<Booking> findExpiredPendingBookings(LocalDateTime expiryTime);
}
