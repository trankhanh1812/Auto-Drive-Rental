package com.carrental.backend.controller;

import com.carrental.backend.dto.ApiResponse;
import com.carrental.backend.dto.payment.PaymentDTO;
import com.carrental.backend.service.payment.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/check-status")
    public ResponseEntity<ApiResponse<PaymentDTO>> checkPaymentStatus(@RequestParam String orderCode) {
        PaymentDTO payment = paymentService.checkPaymentStatus(orderCode);
        return ResponseEntity.ok(ApiResponse.success("Payment status" ,payment));
    }

    @PutMapping("/update-status")
    public ResponseEntity<ApiResponse<PaymentDTO>> updatePaymentStatus(
            @RequestParam String orderCode,
            @RequestParam String status
    ) {
        PaymentDTO payment = paymentService.updatePaymentStatus(orderCode, status);
        return ResponseEntity.ok(ApiResponse.success("Payment status updated" ,payment));

    }
    @PostMapping("/create-final-payment/{bookingId}")
    public ResponseEntity<ApiResponse<PaymentDTO>> createFinalPayment(
            @PathVariable Long bookingId) {
        PaymentDTO payment = paymentService.createFinalPayment(bookingId);
        return ResponseEntity.ok(ApiResponse.success("Final payment created successfully", payment));
    }
}


