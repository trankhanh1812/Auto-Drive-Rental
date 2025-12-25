package com.carrental.backend.repository.review;

import com.carrental.backend.entity.Car;
import com.carrental.backend.entity.Review;
import com.carrental.backend.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long>, ReviewRepositoryCustom {
    List<Review> findByCar(Car car);

    List<Review> findByCar(Car car, Pageable pageable);

    List<Review> findByUser(User user);

    List<Review> findByCarOrderByCreatedAtDesc(Car car);
    List<Review> findByCarOrderByCreatedAtDesc(Car car, Pageable pageable);

    Optional<Review> findByUserAndCar(User user, Car car);
    
    List<Review> findByCarIdIn(List<Long> carIds);
}
