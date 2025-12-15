package com.carrental.backend.repository.payment;

import com.carrental.backend.entity.Payment;

import java.time.LocalDateTime;
import java.util.List;

public interface PaymentRepositoryCustom {

    List<Payment> findByUserId( Long userId);


    List<Payment> findPaymentsByDateRange(LocalDateTime startDate,
                                          LocalDateTime endDate);

    Double getTotalRevenueByDateRange( LocalDateTime startDate,
                                      LocalDateTime endDate);
}
