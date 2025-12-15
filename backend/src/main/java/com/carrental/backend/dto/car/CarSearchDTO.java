package com.carrental.backend.dto.car;

import com.carrental.backend.enums.CarType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CarSearchDTO {
    private CarType carType;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String location;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer minSeats;
}
