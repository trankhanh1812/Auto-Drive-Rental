package com.carrental.backend.controller;


import com.carrental.backend.dto.ApiResponse;
import com.carrental.backend.dto.ApiResponseDto;
import com.carrental.backend.dto.car.CarDTO;
import com.carrental.backend.dto.car.CarSearchDTO;
import com.carrental.backend.entity.Car;
import com.carrental.backend.enums.CarType;
import com.carrental.backend.request.car.CreateCarRequest;
import com.carrental.backend.service.car.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
public class CarController {
    @Autowired
    private CarService carService;

    @GetMapping
    public ResponseEntity<?> getAllCars() {
        List<CarDTO> cars = carService.getAllCars();
        return ApiResponseDto.createdWithState(cars, "Get all cars success", HttpStatus.OK);
    }
    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<CarDTO>>> getAvailableCars() {
        List<CarDTO> cars = carService.getAvailableCars();
        return ResponseEntity.ok(ApiResponse.success(cars));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CarDTO>> getCarById(@PathVariable Long id) {
        CarDTO car = carService.getCarById(id);
        return ResponseEntity.ok(ApiResponse.success(car));
    }

    @GetMapping("/type/{carType}")
    public ResponseEntity<ApiResponse<List<CarDTO>>> getCarsByType(@PathVariable CarType carType) {
        List<CarDTO> cars = carService.getCarsByType(carType);
        return ResponseEntity.ok(ApiResponse.success(cars));
    }

    @GetMapping("/top-rated")
    public ResponseEntity<ApiResponse<List<CarDTO>>> getTopRatedCars() {
        List<CarDTO> cars = carService.getTopRatedCars();
        return ResponseEntity.ok(ApiResponse.success(cars));
    }

    @PostMapping("/search")
    public ResponseEntity<ApiResponse<List<CarDTO>>> searchCars(@RequestBody CarSearchDTO searchDTO) {
        List<CarDTO> cars = carService.searchCars(searchDTO);
        return ResponseEntity.ok(ApiResponse.success(cars));
    }

    @PostMapping
    public ResponseEntity<?> createCar(@RequestBody CreateCarRequest car) {
        Car createdCar = carService.createCar(car);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Car created successfully", createdCar));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CarDTO>> updateCar(@PathVariable Long id, @RequestBody Car car) {
        CarDTO updatedCar = carService.updateCar(id, car);
        return ResponseEntity.ok(ApiResponse.success("Car updated successfully", updatedCar));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.ok(ApiResponse.success("Car deleted successfully", null));
    }
}
