package com.carrental.backend.repository.car.impl;

import com.carrental.backend.entity.Car;
import com.carrental.backend.enums.CarType;
import com.carrental.backend.repository.car.CarRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

import java.math.BigDecimal;
import java.util.List;

public class CarRepositoryImpl implements CarRepositoryCustom {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Car> findAllAvailableCars() {
        StringBuilder sb = new StringBuilder();
        sb.append("""
                select c from Car c
                where c.status = com.carrental.backend.enums.CarStatus.AVAILABLE
                and c.isAvailable = true
                """);
        Query query = entityManager.createQuery(sb.toString());
        return query.getResultList();
    }

    @Override
    public List<Car> findAvailableCarsByType(CarType carType) {
        StringBuilder sb = new StringBuilder();
        sb.append("""
                select c from Car c
                where c.carType = :carType
                and c.isAvailable = true
                """);
        Query query = entityManager.createQuery(sb.toString());
        query.setParameter("carType", carType);
        return query.getResultList();
    }
    @Override
    public List<Car> findAvailableCarsBySeats(Integer minSeats) {
        StringBuilder sb = new StringBuilder();
        sb.append("""
                select c from Car c
                wnere c.seats = :seats
                and c.isAvailable = true                
                """);
        Query query = entityManager.createQuery(sb.toString());
        query.setParameter("seats", minSeats);
        return query.getResultList();
    }

    @Override
    public List<Car> searchCars(CarType carType, BigDecimal minPrice, BigDecimal maxPrice, String location){
        StringBuilder sb = new StringBuilder();
        sb.append("""
                select c from Car c
                where c.isAvailable = true
                """);
        if (carType != null){
            sb.append(" and c.carType = :carType");
        }
        if (minPrice != null){
            sb.append(" and c.pricePerDay >= :minPrice");
        }
        if (maxPrice != null){
            sb.append(" and c.pricePerDay <= :maxPrice");
        }
        if (location != null && location.isEmpty()){
            sb.append(" and LOWER(c.location) like LOWER(:location)");
        }
        Query query = entityManager.createQuery(sb.toString());
        if(carType != null){
            query.setParameter("carType", carType);
        }
        if(minPrice != null){
            query.setParameter("minPrice", minPrice);
        }
        if(maxPrice != null){
            query.setParameter("maxPrice", maxPrice);
        }
        if(location != null && location.isEmpty()){
            query.setParameter("location", "%" + location + "%");
        }
        return query.getResultList();
    }
    @Override
    public List<Car> findTopRatedCars(){
        StringBuilder sb = new StringBuilder();
        sb.append("""
                select c from Car c
                order by c.averageRating DESC, c.totalTrips DESC
                """);
        Query query = entityManager.createQuery(sb.toString());
        return query.setMaxResults(10).getResultList();
    }
}
