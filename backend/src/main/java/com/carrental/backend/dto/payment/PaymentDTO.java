package com.carrental.backend.dto.payment;

import com.carrental.backend.enums.PaymentMethod;
import com.carrental.backend.enums.PaymentStatus;
import com.carrental.backend.enums.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentDTO {
    private Long id;
    private String transactionId;
    private String orderCode;
    private Long bookingId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private PaymentType paymentType;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
    private String description;
}
