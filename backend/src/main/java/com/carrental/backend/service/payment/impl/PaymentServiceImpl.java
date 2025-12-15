package com.carrental.backend.service.payment.impl;

import com.carrental.backend.dto.payment.PaymentDTO;
import com.carrental.backend.entity.Booking;
import com.carrental.backend.entity.Payment;
import com.carrental.backend.enums.PaymentMethod;
import com.carrental.backend.enums.PaymentStatus;
import com.carrental.backend.enums.PaymentType;
import com.carrental.backend.repository.booking.BookingRepository;
import com.carrental.backend.repository.payment.PaymentRepository;
import com.carrental.backend.service.payment.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public PaymentDTO checkPaymentStatus(String orderCode) {
        Payment payment = paymentRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new RuntimeException("Payment not found for order code: " + orderCode));

        return PaymentDTO.builder()
                .id(payment.getId())
                .transactionId(payment.getTransactionId())
                .orderCode(payment.getOrderCode())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .paymentType(payment.getPaymentType())
                .description(payment.getDescription())
                .createdAt(LocalDateTime.now())
                .paidAt(LocalDateTime.now())
                .build();
    }
    @Override
    public PaymentDTO updatePaymentStatus(String orderCode, String status) {
        Payment payment = paymentRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new RuntimeException("Payment not found for order code: " + orderCode));

        PaymentStatus paymentStatus = PaymentStatus.valueOf(status.toUpperCase());
        payment.setStatus(paymentStatus);

        if (paymentStatus == PaymentStatus.COMPLETED) {
            payment.setPaidAt(LocalDateTime.now());
        }

        Payment updated = paymentRepository.save(payment);

        return PaymentDTO.builder()
                .id(updated.getId())
                .transactionId(updated.getTransactionId())
                .orderCode(updated.getOrderCode())
                .amount(updated.getAmount())
                .status(updated.getStatus())
                .paymentMethod(updated.getPaymentMethod())
                .paymentType(updated.getPaymentType())
                .description(updated.getDescription())
                .createdAt(LocalDateTime.now())
                .paidAt(LocalDateTime.now())
                .build();
    }

    @Override
    public PaymentDTO createFinalPayment(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));

        // Check if final payment already exists
//        paymentRepository.findByBookingAndPaymentType(booking, PaymentType.FINAL_PAYMENT)
//                .ifPresent(p -> {
//                    throw new RuntimeException("Final payment already exists for this booking");
//                });
        Optional<Payment> existingPayment = paymentRepository.findByBookingAndPaymentType(booking, PaymentType.FINAL_PAYMENT);
        if (existingPayment.isPresent()) {
            Payment payment = existingPayment.get();
            return PaymentDTO.builder()
                    .id(payment.getId())
                    .transactionId(payment.getTransactionId())
                    .orderCode(payment.getOrderCode())
                    .amount(payment.getAmount())
                    .status(payment.getStatus())
                    .paymentMethod(payment.getPaymentMethod())
                    .paymentType(payment.getPaymentType())
                    .description(payment.getDescription())
                    .createdAt(payment.getCreatedAt())
                    .paidAt(payment.getPaidAt())
                    .build();
        }
        // Calculate remaining amount (70%)
        BigDecimal remainingAmount = booking.getTotalPrice().subtract(booking.getDeposit());

        // Generate unique order code for final payment
        String orderCode = "FINAL-" + bookingId + "-" + System.currentTimeMillis();

        Payment finalPayment = Payment.builder()
                .booking(booking)
                .amount(remainingAmount)
                .orderCode(orderCode)
                .paymentMethod(PaymentMethod.BANK_TRANSFER)
                .paymentType(PaymentType.FINAL_PAYMENT)
                .status(PaymentStatus.PENDING)
                .description("Thanh toán còn lại 70% cho đơn thuê xe #" + booking.getBookingCode())
                .build();

        Payment saved = paymentRepository.save(finalPayment);

        return PaymentDTO.builder()
                .id(saved.getId())
                .transactionId(saved.getTransactionId())
                .orderCode(saved.getOrderCode())
                .amount(saved.getAmount())
                .status(saved.getStatus())
                .paymentMethod(saved.getPaymentMethod())
                .paymentType(saved.getPaymentType())
                .description(saved.getDescription())
                .createdAt(saved.getCreatedAt())
                .build();
    }
}

