package com.carrental.backend.service.car.impl;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.carrental.backend.dto.car.CarDTO;
import com.carrental.backend.dto.car.CarSearchDTO;
import com.carrental.backend.entity.Booking;
import com.carrental.backend.entity.Car;
import com.carrental.backend.entity.Review;
import com.carrental.backend.entity.User;
import com.carrental.backend.enums.BookingStatus;
import com.carrental.backend.enums.CarStatus;
import com.carrental.backend.enums.CarType;
import com.carrental.backend.exception.ValidParametersException;
import com.carrental.backend.repository.booking.BookingRepository;
import com.carrental.backend.repository.car.CarRepository;
import com.carrental.backend.repository.review.ReviewRepository;
import com.carrental.backend.request.car.CreateCarRequest;
import com.carrental.backend.request.car.UpdateCarRequest;
import com.carrental.backend.service.car.CarService;
import com.carrental.backend.service.user.UserService;

@Service
@Transactional
public class CarServiceImpl implements CarService {
    @Autowired
    private CarRepository carRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public Car createCar(CreateCarRequest request)  {
        verifyCreateCarRequest(request);
        //User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userService.getCurrentUser();
        Car car = initializeCar(request, user);
        return carRepository.save(car);
    }
    private void verifyCreateCarRequest(CreateCarRequest request) {
        if (request.getCarType() == null || request.getCarType().equals("")) {
            throw new ValidParametersException();
        }
        if (request.getLicensePlate() == null || request.getLicensePlate().isBlank()) {
            throw new ValidParametersException();
        }
        if (request.getPricePerDay() == null || request.getPricePerDay().intValue() <= 0) {
            throw new ValidParametersException();
        }
    }
    private Car initializeCar(CreateCarRequest request,User user) {
        Car car = new Car();
        car.setCarType(request.getCarType());
        car.setLicensePlate(request.getLicensePlate());
        car.setBrand(request.getBrand());
        car.setModel(request.getModel());
        car.setName(request.getName());
        car.setSeats(request.getSeats());
        car.setTransmission(request.getTransmission());
        car.setFuelType(request.getFuelType());
        car.setLatitude(request.getLatitude());
        car.setLongitude(request.getLongitude());
        car.setStatus(request.getStatus() != null ? request.getStatus() : CarStatus.AVAILABLE);
        car.setColor(request.getColor());
        car.setYear(request.getYear());
        car.setPricePerDay(request.getPricePerDay());
        car.setDescription(request.getDescription());
        car.setTotalTrips(request.getTotalTrips() != null ? request.getTotalTrips() : 0);
        //car.setCreatedBy(user);
        car.setVideoUrl(request.getVideoUrl());

        // Save images and features as comma-separated strings
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            String imageUrlsStr = String.join(",", request.getImageUrls());
            car.setImageUrls(imageUrlsStr);
            System.out.println("Saving image URLs: " + imageUrlsStr);
        }
        if (request.getFeatures() != null && !request.getFeatures().isEmpty()) {
            String featuresStr = String.join(",", request.getFeatures());
            car.setFeatureList(featuresStr);
            System.out.println("Saving features: " + featuresStr);
        }

        car.setIsAvailable(true);
        car.setCreatedAt(LocalDateTime.now());
        car.setUpdatedAt(LocalDateTime.now());
        car.setIdUserCreated(userService.getCurrentUser().getId());
        return car;
    }

    @Override
    public CarDTO updateCar(Long id, Car carDetails) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + id));

        car.setName(carDetails.getName());
        car.setBrand(carDetails.getBrand());
        car.setModel(carDetails.getModel());
        car.setYear(carDetails.getYear());
        car.setCarType(carDetails.getCarType());
        car.setSeats(carDetails.getSeats());
        car.setTransmission(carDetails.getTransmission());
        car.setFuelType(carDetails.getFuelType());
        car.setVideoUrl(carDetails.getVideoUrl());
        car.setPricePerDay(carDetails.getPricePerDay());
        car.setDescription(carDetails.getDescription());
        car.setLocation(carDetails.getLocation());
//        car.setImages(carDetails.getImages());
//        car.setFeatures(carDetails.getFeatures());
        car.setUpdatedAt(LocalDateTime.now());
        car.setIdUserUpdated(userService.getCurrentUser().getId());
        car.setLatitude(carDetails.getLatitude());
        car.setLongitude(carDetails.getLongitude());
        car.setStatus(carDetails.getStatus());
        car.setTotalTrips(carDetails.getTotalTrips());
        Car updatedCar = carRepository.save(car);
       // return updatedCar;
       return convertToDTO(updatedCar);
    }
    @Override
    @Transactional
    public CarDTO updateCarByOwner(Long id, UpdateCarRequest request) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + id));

        if (request.getName() != null) car.setName(request.getName());
        if (request.getBrand() != null) car.setBrand(request.getBrand());
        if (request.getModel() != null) car.setModel(request.getModel());
        if (request.getYear() != null) car.setYear(request.getYear());
        if (request.getCarType() != null) car.setCarType(request.getCarType());
        if (request.getSeats() != null) car.setSeats(request.getSeats());
        if (request.getTransmission() != null) car.setTransmission(request.getTransmission());
        if (request.getFuelType() != null) car.setFuelType(request.getFuelType());
        if (request.getPricePerDay() != null) car.setPricePerDay(request.getPricePerDay());
        if (request.getDescription() != null) car.setDescription(request.getDescription());
        if (request.getVideoUrl() != null) car.setVideoUrl(request.getVideoUrl());
        if (request.getLatitude() != null) car.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) car.setLongitude(request.getLongitude());
        if (request.getStatus() != null) car.setStatus(request.getStatus());

        car.setUpdatedAt(LocalDateTime.now());
        car.setIdUserUpdated(userService.getCurrentUser().getId());

        Car updatedCar = carRepository.save(car);
        return convertToDTO(updatedCar);
    }
    @Override
    public void deleteCar(Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + id));
        carRepository.delete(car);
    }

    @Override
    @Transactional(readOnly = true)
    public CarDTO getCarById(Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + id));
        return convertToDTO(car);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CarDTO> getAllCars() {
        return carRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CarDTO> getAvailableCars() {
        return carRepository.findAllAvailableCars().stream()
                        .filter(car -> car.getApproved() != null && car.getApproved())

                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CarDTO> searchCars(CarSearchDTO searchDTO) {
        return carRepository.searchCars(
                        searchDTO.getCarType(),
                        searchDTO.getMinPrice(),
                        searchDTO.getMaxPrice(),
                        searchDTO.getLocation()
                ).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CarDTO> getCarsByType(CarType carType) {
        return carRepository.findAvailableCarsByType(carType).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CarDTO> getTopRatedCars() {
        return carRepository.findTopRatedCars().stream()
                        .filter(car -> car.getApproved() != null && car.getApproved())

                .limit(10)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void updateCarAvailability(Long carId, Boolean isAvailable) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + carId));
        car.setIsAvailable(isAvailable);
        //car.setStatus(isAvailable ? CarStatus.AVAILABLE : CarStatus.UNAVAILABLE);
        carRepository.save(car);
    }

    @Override
    public void updateCarRating(Long carId) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + carId));
        List<Review> reviews = reviewRepository.findByCar(car);
        Double avgRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        car.setAverageRating(avgRating);
        carRepository.save(car);
    }

    private CarDTO convertToDTO(Car car) {
        List<String> imageList = null;
        if (car.getImageUrls() != null && !car.getImageUrls().isEmpty()) {
            imageList = java.util.Arrays.asList(car.getImageUrls().split(","));
        }

        List<String> featureList = null;
        if (car.getFeatureList() != null && !car.getFeatureList().isEmpty()) {
            featureList = java.util.Arrays.asList(car.getFeatureList().split(","));
        }

        return CarDTO.builder()
                .id(car.getId())
                .name(car.getName())
                .brand(car.getBrand())
                .model(car.getModel())
                .year(car.getYear())
                .licensePlate(car.getLicensePlate())
                .carType(car.getCarType())
                .seats(car.getSeats())
                .transmission(car.getTransmission())
                .fuelType(car.getFuelType())
                .videoUrl(car.getVideoUrl())
                .pricePerDay(car.getPricePerDay())
                .description(car.getDescription())
                .videoUrl(car.getVideoUrl())
                .location(car.getLocation())
                .latitude(car.getLatitude())
                .longitude(car.getLongitude())
                .images(imageList)
                .features(featureList)
                //.images(car.getImages())
                //.features(car.getFeatures())
                .status(car.getStatus())
                .isAvailable(car.getIsAvailable())
                .averageRating(car.getAverageRating())
                .totalTrips(car.getTotalTrips())
                .approved(car.getApproved())
                                .rejectionReason(car.getRejectionReason())

                .createdAt(car.getCreatedAt())
                .idUserCreated(car.getIdUserCreated())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CarDTO> getOwnerCars(Long ownerId) {
        return carRepository.findByIdUserCreated(ownerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Long countOwnerCars(Long ownerId) {
        return carRepository.countByIdUserCreated(ownerId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CarDTO> getPendingCars() {
        List<Car> pendingCars = carRepository.findByApproved(false);
        return pendingCars.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    @Override
    public CarDTO approveCar(Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));
        car.setApproved(true);
        Car savedCar = carRepository.save(car);
        return convertToDTO(savedCar);
    }

    @Override
    public void rejectCar(Long id, String reason) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));
        // For now, just delete the car. In future, could implement notification system
        car.setApproved(false);
        car.setRejectionReason(reason);
        car.setIsAvailable(false);
        carRepository.save(car);
        // TODO: Send notification to owner with rejection reason
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getCarBookedDates(Long carId) {
        // Get all confirmed and in-progress bookings for this car
        List<Booking> bookings = bookingRepository.findByCarId(carId).stream()
                .filter(booking -> 
                    booking.getStatus() == BookingStatus.CONFIRMED ||
                    booking.getStatus() == BookingStatus.IN_PROGRESS ||
                    booking.getStatus() == BookingStatus.PENDING
                )
                .collect(Collectors.toList());

        return bookings.stream().map(booking -> {
            Map<String, Object> dateMap = new HashMap<>();
            dateMap.put("startDate", booking.getStartDate().toString());
            dateMap.put("endDate", booking.getEndDate().toString());
            dateMap.put("status", booking.getStatus().toString());
            return dateMap;
        }).collect(Collectors.toList());
    }
}
