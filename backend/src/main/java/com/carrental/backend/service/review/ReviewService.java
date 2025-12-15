package com.carrental.backend.service.review;

import com.carrental.backend.dto.review.ReviewDTO;
import com.carrental.backend.dto.review.ReviewRequestDTO;

import java.util.List;

public interface ReviewService {
    ReviewDTO createReview(ReviewRequestDTO request);
    List<ReviewDTO> getCarReviews(Long carId);
    List<ReviewDTO> getUserReviews(Long userId);
    void deleteReview(Long reviewId);
}
