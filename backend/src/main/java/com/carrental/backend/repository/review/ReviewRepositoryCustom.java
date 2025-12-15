package com.carrental.backend.repository.review;

import com.carrental.backend.entity.Review;

import java.util.List;

public interface ReviewRepositoryCustom {
    Double getAverageRatingByCar(Long carId);

    Long countReviewsByCar(Long carId);

    List<Review> findHighRatedReviews(Integer minRating);
}
