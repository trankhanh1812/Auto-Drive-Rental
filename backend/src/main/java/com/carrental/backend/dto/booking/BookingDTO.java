package com.carrental.backend.dto.booking;

import com.carrental.backend.dto.payment.PaymentDTO;
import com.carrental.backend.enums.BookingStatus;
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
public class BookingDTO {
    private Long id;
    private String bookingCode;
    private String orderCode;
    private Long userId;
    private String userFullName;
    private String userEmail;
    private String userPhoneNumber;
    private Long carId;
    private String carName;
    private String carBrand;
    private String carModel;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer totalDays;
    private BigDecimal totalPrice;
    private BigDecimal deposit;
    private String pickupLocation;
    private String dropoffLocation;
    private String carLicensePlate;
    private BigDecimal carPricePerDay;
    private Long carOwnerId;
    private String carOwnerName;
    private String carOwnerPhone;
    private String carOwnerBankName;
    private String carOwnerBankAccountNumber;
    private String carOwnerBankAccountName;
    private BookingStatus status;
    private String notes;
    private PaymentDTO payment;
    private LocalDateTime createdAt;
}
