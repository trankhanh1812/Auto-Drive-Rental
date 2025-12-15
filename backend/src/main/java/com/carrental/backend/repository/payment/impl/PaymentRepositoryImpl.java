package com.carrental.backend.repository.payment.impl;

import com.carrental.backend.entity.Payment;
import com.carrental.backend.repository.payment.PaymentRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

import java.time.LocalDateTime;
import java.util.List;

public class PaymentRepositoryImpl implements PaymentRepositoryCustom {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Payment> findByUserId(Long userId){
        StringBuilder sb = new StringBuilder();
        sb.append("""
                select p from Payment p
                where p.booking.user.id = :userId
                order by p.createdAt desc
                """);
        Query query = entityManager.createNativeQuery(sb.toString());
        query.setParameter("userId", userId);
        return query.getResultList();
    }

    @Override
    public List<Payment> findPaymentsByDateRange(LocalDateTime startDate,
                                          LocalDateTime endDate){
        StringBuilder sb = new StringBuilder();
        sb.append("""
                select p from Payment p
                where p.createdAt between :startDate and :endDate
                """);
        Query query = entityManager.createNativeQuery(sb.toString());
        query.setParameter("startDate", startDate);
        query.setParameter("endDate", endDate);
        return query.getResultList();
    }

    @Override
    public Double getTotalRevenueByDateRange( LocalDateTime startDate,
                                       LocalDateTime endDate){
        StringBuilder sb = new StringBuilder();
        sb.append("""
                select sum(p.amount) from Payment p
                where p.status = 'COMPLETED'
                and p.paidAt between :startDate and :endDate
                """);
        Query query = entityManager.createNativeQuery(sb.toString());
        query.setParameter("startDate", startDate);
        query.setParameter("endDate", endDate);
        return (Double) query.getSingleResult();
    }
}
