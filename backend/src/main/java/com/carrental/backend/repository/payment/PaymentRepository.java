package com.carrental.backend.repository.payment;

import com.carrental.backend.entity.Booking;
import com.carrental.backend.entity.Payment;
import com.carrental.backend.enums.PaymentStatus;

import com.carrental.backend.enums.PaymentType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long>, PaymentRepositoryCustom{
    //Optional<Payment> findByTransactionId(String transactionId);

    Optional<Payment> findByOrderCode(String orderCode);
    Optional<Payment> findByBooking(Booking booking);

    Optional<Payment> findByBookingAndPaymentType(Booking booking, PaymentType paymentType);
    List<Payment> findByStatus(PaymentStatus status);

//    @Query("SELECT p FROM Payment p WHERE p.booking.user.id = :userId ORDER BY p.createdAt DESC")
//    List<Payment> findByUserId(@Param("userId") Long userId);
//
//    @Query("SELECT p FROM Payment p WHERE p.createdAt BETWEEN :startDate AND :endDate")
//    List<Payment> findPaymentsByDateRange(@Param("startDate") LocalDateTime startDate,
//                                          @Param("endDate") LocalDateTime endDate);
//
//    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' AND p.paidAt BETWEEN :startDate AND :endDate")
//    Double getTotalRevenueByDateRange(@Param("startDate") LocalDateTime startDate,
//                                      @Param("endDate") LocalDateTime endDate);
}
