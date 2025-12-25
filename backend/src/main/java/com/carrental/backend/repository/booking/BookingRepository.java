package com.carrental.backend.repository.booking;

import com.carrental.backend.entity.Booking;
import com.carrental.backend.entity.Car;
import com.carrental.backend.entity.User;
import com.carrental.backend.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long>, BookingRepositoryCustom {
    Optional<Booking> findByBookingCode(String bookingCode);

    Optional<Booking> findByOrderCode(String orderCode);
    List<Booking> findByUser(User user);

    List<Booking> findByUserOrderByCreatedAtDesc(User user);

    List<Booking> findByCar(Car car);

    List<Booking> findByCarIdUserCreatedOrderByCreatedAtDesc(Long ownerId);
    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByUserAndStatus(User user, BookingStatus status);

    Optional<Object> findByCarId(Long carId);

//    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId ORDER BY b.createdAt DESC")
//    List<Booking> findByUserId(@Param("userId") Long userId);
//
//    @Query("SELECT b FROM Booking b WHERE b.car.id = :carId AND b.status IN ('CONFIRMED', 'IN_PROGRESS')")
//    List<Booking> findActiveBookingsByCar(@Param("carId") Long carId);
//
//    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM Booking b WHERE " +
//            "b.car.id = :carId AND b.status IN ('CONFIRMED', 'IN_PROGRESS') AND " +
//            "((b.startDate BETWEEN :startDate AND :endDate) OR " +
//            "(b.endDate BETWEEN :startDate AND :endDate) OR " +
//            "(b.startDate <= :startDate AND b.endDate >= :endDate))")
//    Boolean isCarBookedInPeriod(@Param("carId") Long carId,
//                                @Param("startDate") LocalDateTime startDate,
//                                @Param("endDate") LocalDateTime endDate);
//
//    @Query("SELECT b FROM Booking b WHERE b.startDate BETWEEN :startDate AND :endDate")
//    List<Booking> findBookingsByDateRange(@Param("startDate") LocalDateTime startDate,
//                                          @Param("endDate") LocalDateTime endDate);
//
//    @Query("SELECT COUNT(b) FROM Booking b WHERE b.user.id = :userId")
//    Long countByUserId(@Param("userId") Long userId);
//
//    @Query("SELECT b FROM Booking b WHERE b.status = 'PENDING' AND b.createdAt < :expiryTime")
//    List<Booking> findExpiredPendingBookings(@Param("expiryTime") LocalDateTime expiryTime);
}
