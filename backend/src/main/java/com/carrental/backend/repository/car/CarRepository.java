package com.carrental.backend.repository.car;

import com.carrental.backend.entity.Car;
import com.carrental.backend.enums.CarStatus;
import com.carrental.backend.enums.CarType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Repository
public interface CarRepository extends JpaRepository<Car, Long>, CarRepositoryCustom {
    Optional<Car> findByLicensePlate(String licensePlate);

    //List<Car> findByStatus(CarStatus status);

    List<Car> findByIsAvailableTrue();

    List<Car> findByCarType(CarType carType);

    List<Car> findByBrand(String brand);

    List<Car> findByNameContainingIgnoreCase(String name);

    List<Car> findByPricePerDayBetween(BigDecimal minPrice, BigDecimal maxPrice);

    List<Car> findByIdUserCreated(Long ownerId);
    
    List<Car> findByCreatedByUserId(Long ownerId);

    Long countByIdUserCreated(Long ownerId);

    List<Car> findByApproved(Boolean approved);

//    @Query("SELECT c FROM Car c WHERE c.isAvailable = true AND c.status = 'AVAILABLE'")
//    List<Car> findAllAvailableCars();
//
//    @Query("SELECT c FROM Car c WHERE c.carType = :carType AND c.isAvailable = true")
//    List<Car> findAvailableCarsByType(@Param("carType") CarType carType);
//
//    @Query("SELECT c FROM Car c WHERE c.seats >= :minSeats AND c.isAvailable = true")
//    List<Car> findAvailableCarsBySeats(@Param("minSeats") Integer minSeats);
//
//    @Query("SELECT c FROM Car c WHERE " +
//            "(:carType IS NULL OR c.carType = :carType) AND " +
//            "(:minPrice IS NULL OR c.pricePerDay >= :minPrice) AND " +
//            "(:maxPrice IS NULL OR c.pricePerDay <= :maxPrice) AND " +
//            "(:location IS NULL OR c.location LIKE %:location%) AND " +
//            "c.isAvailable = true")
//    List<Car> searchCars(@Param("carType") CarType carType,
//                         @Param("minPrice") BigDecimal minPrice,
//                         @Param("maxPrice") BigDecimal maxPrice,
//                         @Param("location") String location);
//
//    @Query("SELECT c FROM Car c ORDER BY c.averageRating DESC, c.totalTrips DESC")
//    List<Car> findTopRatedCars();
}
