package com.carrental.backend.entity;

import com.carrental.backend.enums.CarStatus;
import com.carrental.backend.enums.CarType;
import com.carrental.backend.enums.FuelType;
import com.carrental.backend.enums.TransmissionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "cars")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String brand;
    @Column(nullable = false)
    private String model;
    @Column(nullable = false)
    private Integer year;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CarType carType;
    @Column(nullable = false)
    private String seats;
    @Column(nullable = false, unique = true)
    private String licensePlate;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TransmissionType transmission;
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private FuelType fuelType;
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerDay;
    private String color;
    @Column(length = 2000)
    private String description;
    @Column(length = 500)
    private String videoUrl;
    private String location;
    private BigDecimal longitude;
    private BigDecimal latitude;
    //@Column(nullable = false)
    private CarStatus status;
    @Column(nullable = false)
    private Boolean isAvailable = true;
    @Column(nullable = false)
    private Integer totalTrips = 0;

    private Double averageRating = 0.0;
    @Column(nullable = false)
    private Boolean approved = false;
    @Column(length = 500)
    private String rejectionReason;
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Long idUserCreated;
    private Long idUserUpdated;
    @Column(length = 2000)
    private String imageUrls;

    @Column(length = 1000)
    private String featureList;
//    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
//    private Set<CarImage> images = new HashSet<>();
//
//    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
//    private Set<CarFeature> features = new HashSet<>();

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Booking> bookings = new HashSet<>();

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Review> reviews = new HashSet<>();
//    @ElementCollection
//    @CollectionTable(name = "car_images", joinColumns = @JoinColumn(name = "car_id"))
//    @Column(name = "image_url")
//    private Set<String> images = new HashSet<>();
//
//    @ElementCollection
//    @CollectionTable(name = "car_features", joinColumns = @JoinColumn(name = "car_id"))
//    @Column(name = "feature")
//    private Set<String> features = new HashSet<>();


}
