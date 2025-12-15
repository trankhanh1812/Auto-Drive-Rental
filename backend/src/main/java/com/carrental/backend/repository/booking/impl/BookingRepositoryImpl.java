package com.carrental.backend.repository.booking.impl;

import com.carrental.backend.entity.Booking;
import com.carrental.backend.repository.booking.BookingRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

import java.time.LocalDateTime;
import java.util.List;

public class BookingRepositoryImpl implements BookingRepositoryCustom {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Booking> findByUserId(Long userId){
        StringBuilder sb = new StringBuilder();
        sb.append("""
                select b from Booking b
                where b.user.id = :userId
                order by b.createdAt desc
                """);
        Query query = entityManager.createNativeQuery(sb.toString());
        query.setParameter("userId", userId);
        return query.getResultList();
    }

    @Override
    public List<Booking> findActiveBookingsByCar( Long carId) {
        StringBuilder sb = new StringBuilder();
        sb.append("""
               select b from Booking b
               where b.car.id = :carId
               and b.status IN ('CONFIRMED', 'IN_PROGRESS')
               """);
        Query query = entityManager.createNativeQuery(sb.toString());
        query.setParameter("carId", carId);
        return query.getResultList();
    }

    @Override
    public  Boolean isCarBookedInPeriod(Long carId, LocalDateTime startDate, LocalDateTime endDate){
        StringBuilder sb = new StringBuilder();
        sb.append("""
                select count(b) from Booking b
                where b.car.id = :carId
                and b.status IN ('CONFIRMED', 'IN_PROGRESS')
                and (b.startDate BETWEEN :startDate and :endDate
                or b.endDate BETWEEN :startDate and :endDate
                or b.startDate <= :startDate and :endDate >= :endDate)
                """);
        Query query = entityManager.createNativeQuery(sb.toString());
        query.setParameter("carId", carId);
        query.setParameter("startDate", startDate);
        query.setParameter("endDate", endDate);
        Long count = (Long) query.getSingleResult();
        return count > 0;
    }

    @Override
    public List<Booking> findBookingsByDateRange(LocalDateTime startDate,
                                          LocalDateTime endDate){
        StringBuilder sb = new StringBuilder();
        sb.append("""
                select b from Booking b
                where b.startDate BETWEEN :startDate and :endDate
                """);
        Query query = entityManager.createNativeQuery(sb.toString());
        query.setParameter("startDate", startDate);
        query.setParameter("endDate", endDate);
        return query.getResultList();
    }

    @Override
    public Long countByUserId(Long userId){
        StringBuilder sb = new StringBuilder();
        sb.append("""
                select count(b) from Booking b
                where b.user.id = :userId
                """);
        Query query = entityManager.createNativeQuery(sb.toString());
        query.setParameter("userId", userId);
        return (Long) query.getSingleResult();
    }

    @Override
    public List<Booking> findExpiredPendingBookings(LocalDateTime expiryTime){
        StringBuilder sb = new StringBuilder();
        sb.append("""
                select b from Booking b
                where b.status = 'PENDING'
                and b.createdAt < :expiryTime
                """);
        Query query = entityManager.createNativeQuery(sb.toString());
        query.setParameter("expiryTime", expiryTime);
        return query.getResultList();
    }

}
