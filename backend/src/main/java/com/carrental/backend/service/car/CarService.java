package com.carrental.backend.service.car;

import com.carrental.backend.dto.car.CarDTO;
import com.carrental.backend.dto.car.CarSearchDTO;
import com.carrental.backend.entity.Car;
import com.carrental.backend.enums.CarType;
import com.carrental.backend.request.car.CreateCarRequest;
import com.carrental.backend.request.car.UpdateCarRequest;

import java.util.List;
import java.util.Map;

public interface CarService {
    Car createCar(CreateCarRequest request);
    CarDTO updateCar(Long id, Car carDetails);
    CarDTO updateCarByOwner(Long id, UpdateCarRequest request);
    void deleteCar(Long id);
    CarDTO getCarById(Long id);
    List<CarDTO> getAllCars();
  //  List<CarDTO> getCarsByLocation(String location);
    List<CarDTO> getAvailableCars();
    List<CarDTO> searchCars(CarSearchDTO searchDTO);
    List<CarDTO> getCarsByType(CarType type);
    List<CarDTO> getTopRatedCars();
    void updateCarAvailability(Long id, Boolean isAvailable);
    void updateCarRating(Long id);
    List<CarDTO> getOwnerCars(Long ownerId);
    Long countOwnerCars(Long ownerId);
    List<CarDTO> getPendingCars();
    CarDTO approveCar(Long id);
    void rejectCar(Long id, String reason);
    List<Map<String, Object>> getCarBookedDates(Long carId);
}
