package com.carrental.backend.dto.car;

import com.carrental.backend.entity.CarFeature;
import com.carrental.backend.entity.CarImage;
import com.carrental.backend.enums.CarStatus;
import com.carrental.backend.enums.CarType;
import com.carrental.backend.enums.FuelType;
import com.carrental.backend.enums.TransmissionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CarDTO {
    private Long id;
    private String name;
    private String brand;
    private String model;
    private Integer year;
    private String licensePlate;
    private CarType carType;
    private String seats;
    private TransmissionType transmission;
    private FuelType fuelType;
    private BigDecimal pricePerDay;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String description;
    private String videoUrl;
    private String location;
    private CarStatus status;
    private Boolean isAvailable;
    private Double averageRating;
    private Integer totalTrips;
    private Boolean approved;
    private List<String> images;
    private List<String> features;
    private LocalDateTime createdAt;
    private Long idUserCreated;
}
