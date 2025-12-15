package com.carrental.backend.request.car;

import com.carrental.backend.entity.CarFeature;
import com.carrental.backend.entity.CarImage;
import com.carrental.backend.enums.CarStatus;
import com.carrental.backend.enums.CarType;
import com.carrental.backend.enums.FuelType;
import com.carrental.backend.enums.TransmissionType;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateCarRequest {
    private CarType carType;
    private String name;
    private String brand;
    private String model;
    private String licensePlate;
    private String seats;
    private TransmissionType transmission;
    private FuelType fuelType;
    private String color;
    private Integer year;
    private BigDecimal pricePerDay;
    private String description;
    private BigDecimal longitude;
    private BigDecimal latitude;
    private Integer totalTrips;
    private CarStatus status;
    private String videoUrl;
    private List<String> imageUrls;
    private List<String> features;
}
