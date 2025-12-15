package com.carrental.backend.repository.review.impl;


import com.carrental.backend.entity.Review;
import com.carrental.backend.repository.review.ReviewRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

import javax.swing.plaf.SpinnerUI;
import java.util.List;

public class ReviewRepositoryImpl implements ReviewRepositoryCustom {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Double getAverageRatingByCar(Long carId){
        StringBuilder sb = new StringBuilder();
        sb.append("""
                select avg(r.rating) from Review r
                where r.car.id =:carId
                """);
        Query query = entityManager.createNativeQuery(sb.toString());
        query.setParameter("carId", carId);
        return (Double)query.getSingleResult();
    }
    @Override

    public Long countReviewsByCar(Long carId){
        StringBuilder sb = new StringBuilder();
        sb.append("""
                select count(r.id) from Review r
                where r.car.id =:carId
                """);
        Query query = entityManager.createNativeQuery(sb.toString());
        query.setParameter("carId", carId);
        return (Long)query.getSingleResult();
    }
    @Override

    public List<Review> findHighRatedReviews(Integer minRating){
        StringBuilder sb = new StringBuilder();
        sb.append("""
                select r from Review r
                where r.rating >= :minRating
                order by r.createdAt desc
                """);
        Query query = entityManager.createNativeQuery(sb.toString());
        query.setParameter("minRating", minRating);
        return query.getResultList();
    }
}
