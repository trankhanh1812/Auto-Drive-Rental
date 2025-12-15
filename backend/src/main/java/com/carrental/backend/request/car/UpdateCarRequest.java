package com.carrental.backend.request.car;

import com.carrental.backend.enums.CarStatus;
import com.carrental.backend.enums.CarType;
import com.carrental.backend.enums.FuelType;
import com.carrental.backend.enums.TransmissionType;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateCarRequest {
    private CarType carType;
    private String name;
    private String brand;
    private String model;
    private String seats;
    private TransmissionType transmission;
    private FuelType fuelType;
    private String color;
    private Integer year;
    private BigDecimal pricePerDay;
    private String description;
    private String videoUrl;
    private BigDecimal longitude;
    private BigDecimal latitude;
    private CarStatus status;
}
