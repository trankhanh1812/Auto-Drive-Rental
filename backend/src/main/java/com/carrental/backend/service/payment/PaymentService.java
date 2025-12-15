package com.carrental.backend.service.payment;

import com.carrental.backend.dto.payment.PaymentDTO;

public interface PaymentService {
    PaymentDTO checkPaymentStatus(String orderCode);
    PaymentDTO updatePaymentStatus(String orderCode, String status);
    PaymentDTO createFinalPayment(Long BookingId);
}
