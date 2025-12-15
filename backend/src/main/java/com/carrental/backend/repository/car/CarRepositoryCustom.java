package com.carrental.backend.repository.car;

import com.carrental.backend.entity.Car;
import com.carrental.backend.enums.CarType;

import java.math.BigDecimal;
import java.util.List;

public interface CarRepositoryCustom {
    List<Car> findAllAvailableCars();

    List<Car> findAvailableCarsByType(CarType type);

    List<Car> findAvailableCarsBySeats(Integer minSeats);

    List<Car> searchCars(CarType carType, BigDecimal minPrice, BigDecimal maxPrice, String location);

    List<Car> findTopRatedCars();
}
