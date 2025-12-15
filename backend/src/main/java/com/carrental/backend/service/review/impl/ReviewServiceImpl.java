package com.carrental.backend.service.review.impl;

import com.carrental.backend.dto.review.ReviewDTO;
import com.carrental.backend.dto.review.ReviewRequestDTO;
import com.carrental.backend.entity.Booking;
import com.carrental.backend.entity.Car;
import com.carrental.backend.entity.Review;
import com.carrental.backend.entity.User;
import com.carrental.backend.enums.BookingStatus;
import com.carrental.backend.repository.booking.BookingRepository;
import com.carrental.backend.repository.car.CarRepository;
import com.carrental.backend.repository.review.ReviewRepository;
import com.carrental.backend.repository.user.UserRepository;
import com.carrental.backend.service.car.CarService;
import com.carrental.backend.service.review.ReviewService;
import com.carrental.backend.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CarRepository carRepository;
    @Autowired
    private CarService carService;
    @Autowired
    private BookingRepository bookingRepository;


    @Override
    public ReviewDTO createReview( ReviewRequestDTO request){
        // kiểm tra tồn tại bk
        String usernameOrEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(usernameOrEmail)
                .or(() -> userRepository.findByEmail(usernameOrEmail))
                .orElseThrow(() -> new RuntimeException("User not found"));
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        // ktra user có quyền đgia ko
        if(!booking.getUser().getId().equals(currentUser.getId())){
            throw new RuntimeException("You are not allowed to create a review");
        }
        // ktra booking đã hoàn thành chưa
        if(booking.getStatus() != BookingStatus.COMPLETED) {
            throw new RuntimeException("Only complete booking is supported");
        }
        // ktra đánh giá chưa
//        if(reviewRepository.existsByBookingId(request.getBookingId()))
        //User user = userRepository.findById(currentUser).orElseThrow(() -> new RuntimeException("User not found"));

        Car car = carRepository.findById(request.getCarId()).orElseThrow(() -> new RuntimeException("Car not found"));

        if(reviewRepository.findByUserAndCar(currentUser, car).isPresent()){
            throw new RuntimeException("You have already reviewed this car");
        }
        if(request.getRating() < 1 || request.getRating() > 5){
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        Review review = new Review();
        review.setUser(currentUser);
        review.setCar(car);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        Review savedReview = reviewRepository.save(review);
        carService.updateCarRating(car.getId());
        return convertToDTO(savedReview);
    }
    @Override
    @Transactional(readOnly = true)
    public List<ReviewDTO> getCarReviews(Long carId){
        Car car = carRepository.findById(carId).orElseThrow(() -> new RuntimeException("Car not found"));
//        List<Review> reviews = reviewRepository.findByCarOrderByCreatedAtDesc(car)
        return reviewRepository.findByCarOrderByCreatedAtDesc(car).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewDTO> getUserReviews(Long userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<Review> reviews = reviewRepository.findByUser(user);
        List<ReviewDTO> dtos = new ArrayList<>();
        for(Review review : reviews){
            dtos.add(convertToDTO(review));
        }
        return dtos;
//        return reviewRepository.findByUser(user).stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
    }
    @Override
    public void deleteReview(Long reviewId){
        Review review = reviewRepository.findById(reviewId).orElseThrow(() -> new RuntimeException("Review not found"));

        Long carId = review.getCar().getId();
        reviewRepository.delete(review);
        carService.updateCarRating(carId);
    }

    private ReviewDTO convertToDTO(Review review){
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setComment(review.getComment());
        dto.setRating(review.getRating());
        dto.setUserId(review.getUser().getId());
        dto.setUserFullName(review.getUser().getFullName());
        dto.setCarId(review.getCar().getId());
        dto.setCarName(review.getCar().getName());
        dto.setCreatedAt(review.getCreatedAt());

        return dto;
    }
}
