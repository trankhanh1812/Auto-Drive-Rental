//package com.carrental.backend.service.booking.impl;
//
//import com.carrental.backend.dto.booking.BookingDTO;
//import com.carrental.backend.dto.booking.BookingRequestDTO;
//import com.carrental.backend.entity.Booking;
//import com.carrental.backend.entity.Car;
//import com.carrental.backend.entity.User;
//import com.carrental.backend.enums.BookingStatus;
//import com.carrental.backend.repository.booking.BookingRepository;
//import com.carrental.backend.repository.car.CarRepository;
//import com.carrental.backend.repository.payment.PaymentRepository;
//import com.carrental.backend.repository.user.UserRepository;
//import com.carrental.backend.service.booking.BookingService;
//import com.carrental.backend.service.car.CarService;
//import jakarta.transaction.Transactional;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.math.BigDecimal;
//import java.time.temporal.ChronoUnit;
//
//@Service
//@Transactional
//public class BookingServiceImpl implements BookingService {
//
//    @Autowired
//    private BookingRepository bookingRepository;
//    @Autowired
//    private CarRepository carRepository;
//    @Autowired
//    private UserRepository userRepository;
//    @Autowired
//    private PaymentRepository paymentRepository;
//
//    @Override
//    public BookingDTO createBooking(Long userId, BookingRequestDTO request){
//        //validate user
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//        Car car = carRepository.findById(request.getCarId())
//                .orElseThrow(() -> new RuntimeException("Car not found"));
//        if(!car.getIsAvailable()) {
//            throw new RuntimeException("Car is not available");
//        }
//        Boolean isBooked = bookingRepository.isCarBookedInPeriod(
//                car.getId(), request.getStartDate(), request.getEndDate()
//        );
//        if(isBooked) {
//            throw new RuntimeException("Car is already booked");
//        }
//        long totalDays = ChronoUnit.DAYS.between(
//                request.getStartDate(), request.getEndDate()
//        );
//        if(totalDays < 0) {
//            throw new RuntimeException("End date must be after start date");
//        }
//        BigDecimal totalPrice = car.getPricePerDay().multiply(new BigDecimal(totalDays));
//        BigDecimal deposit = totalPrice.multiply(BigDecimal.valueOf(0.3));
//        Booking booking = Booking.builder()
//                .user(user)
//                .car(car)
//                .startDate(request.getStartDate())
//                .endDate(request.getEndDate())
//                .totalDays((int)totalDays)
//                .totalPrice(totalPrice)
//                .deposit(deposit)
//                .pickupLocation(request.getPickupLocation())
//                .dropoffLocation(request.getDropoffLocation())
//                .notes(request.getNotes())
//                .status(BookingStatus.PENDING)
//                .build();
//
//        Booking savedBooking = bookingRepository.save(booking);
//
//        return convertToDTO(savedBooking);
//
//    }
//
////    @Override
////    public BookingDTO confirmBooking(Long bookingId) {
////
////    }
//    private BookingDTO convertToDTO(Booking booking) {
//        BookingDTO dto = BookingDTO.builder()
//                .id(booking.getId())
//                .bookingCode(booking.getBookingCode())
//                .userId(booking.getUser().getId())
//                .userFullName(booking.getUser().getFullName())
//                .userEmail(booking.getUser().getEmail())
//                .userPhoneNumber(booking.getUser().getPhoneNumber())
//                .carId(booking.getCar().getId())
//                .carName(booking.getCar().getName())
//                .carBrand(booking.getCar().getBrand())
//                .carModel(booking.getCar().getModel())
//                .startDate(booking.getStartDate())
//                .endDate(booking.getEndDate())
//                .totalDays(booking.getTotalDays())
//                .totalPrice(booking.getTotalPrice())
//                .deposit(booking.getDeposit())
//                .pickupLocation(booking.getPickupLocation())
//                .dropoffLocation(booking.getDropoffLocation())
//                .status(booking.getStatus())
//                .notes(booking.getNotes())
//                .createdAt(booking.getCreatedAt())
//                .build();
//
//        // Add payment info if exists
////        if (booking.getPayment() != null) {
////            dto.setPayment(convertPaymentToDTO(booking.getPayment()));
////        }
//
//        return dto;
//    }
//}
package com.carrental.backend.service.booking.impl;

import com.carrental.backend.dto.booking.BookingDTO;
import com.carrental.backend.dto.booking.BookingRequestDTO;
import com.carrental.backend.entity.Booking;
import com.carrental.backend.entity.Car;
import com.carrental.backend.entity.Payment;
import com.carrental.backend.entity.User;
import com.carrental.backend.enums.BookingStatus;
import com.carrental.backend.enums.PaymentMethod;
import com.carrental.backend.enums.PaymentStatus;
import com.carrental.backend.enums.PaymentType;
import com.carrental.backend.repository.booking.BookingRepository;
import com.carrental.backend.repository.car.CarRepository;
import com.carrental.backend.repository.payment.PaymentRepository;
import com.carrental.backend.repository.user.UserRepository;
import com.carrental.backend.service.booking.BookingService;
import com.carrental.backend.service.user.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private CarRepository carRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private UserService userService;

    @Override
    public BookingDTO createBooking(BookingRequestDTO request) {
        User currentUser = userService.getCurrentUser();

        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new RuntimeException("Car not found"));

        if (!car.getIsAvailable()) {
            throw new RuntimeException("Car is not available");
        }

        long totalDays = ChronoUnit.DAYS.between(
                request.getStartDate(), request.getEndDate()
        );
        if (totalDays <= 0) {
            throw new RuntimeException("End date must be after start date");
        }

        BigDecimal totalPrice = car.getPricePerDay().multiply(new BigDecimal(totalDays));
        //BigDecimal deposit = request.getDeposit() != null ?
              //  request.getDeposit() : totalPrice.multiply(BigDecimal.valueOf(0.3));
        BigDecimal deposit = totalPrice.multiply(BigDecimal.valueOf(0.3)).setScale(0, java.math.RoundingMode.HALF_UP);

        // Generate order code
        String orderCode = "ORDER_" + System.currentTimeMillis() + "_" +
                (int)(Math.random() * 1000);

        Booking booking = Booking.builder()
                .user(currentUser)
                .car(car)
                .orderCode(orderCode)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .totalDays((int)totalDays)
                .totalPrice(totalPrice)
                .deposit(deposit)
                .pickupLocation(request.getPickupLocation())
                .dropoffLocation(request.getDropoffLocation())
                .notes(request.getNotes())
                .status(BookingStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        // Create payment record
        Payment payment = Payment.builder()
                .booking(savedBooking)
                .orderCode(orderCode)
                .amount(deposit)
                .status(PaymentStatus.PENDING)
                .paymentMethod(PaymentMethod.BANK_TRANSFER)
                .paymentType(PaymentType.DEPOSIT)
                .description("Deposit for booking " + savedBooking.getBookingCode())
                .createdAt(LocalDateTime.now())
                .build();
        paymentRepository.save(payment);

        return convertToDTO(savedBooking);
    }

    @Override
    public BookingDTO getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return convertToDTO(booking);
    }

    @Override
    public BookingDTO getBookingByOrderCode(String orderCode) {
        Booking booking = bookingRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new RuntimeException("Booking not found with order code: " + orderCode));
        return convertToDTO(booking);
    }

    @Override
    public List<BookingDTO> getUserBookings() {
        User currentUser = userService.getCurrentUser();
        return bookingRepository.findByUserOrderByCreatedAtDesc(currentUser).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingDTO> getOwnerBookings(Long ownerId) {
        return bookingRepository.findByCarIdUserCreatedOrderByCreatedAtDesc(ownerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BookingDTO approveBooking(Long bookingId) {
        User currentUser = userService.getCurrentUser();
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Verify owner
        if (!booking.getCar().getIdUserCreated().equals(currentUser.getId())) {
            throw new RuntimeException("You can only approve bookings for your own cars");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be approved");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setUpdatedAt(LocalDateTime.now());
        Booking updated = bookingRepository.save(booking);

        return convertToDTO(updated);
    }

    @Override
    public BookingDTO rejectBooking(Long bookingId) {
        User currentUser = userService.getCurrentUser();
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Verify owner
        if (!booking.getCar().getIdUserCreated().equals(currentUser.getId())) {
            throw new RuntimeException("You can only reject bookings for your own cars");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be rejected");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        Booking updated = bookingRepository.save(booking);

        return convertToDTO(updated);
    }
    @Override
    public BookingDTO startBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new RuntimeException("Only confirmed bookings can be started");
        }

        booking.setStatus(BookingStatus.IN_PROGRESS);
        booking.setUpdatedAt(LocalDateTime.now());
        booking.setActualStartDate(LocalDateTime.now());
        Booking updated = bookingRepository.save(booking);

        return convertToDTO(updated);
    }
    @Override
    public BookingDTO completeBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (booking.getStatus() != BookingStatus.IN_PROGRESS) {
            throw new RuntimeException("Only in-progress bookings can be completed");
        }
//        Optional<Payment> finalPayment = paymentRepository.findByBookingAndPaymentType(booking, PaymentType.FINAL_PAYMENT);
//        if (finalPayment.isEmpty() || finalPayment.get().getStatus() != PaymentStatus.COMPLETED) {
//            throw new RuntimeException("Final payment must be completed before completing the booking");
//        }
        booking.setStatus(BookingStatus.COMPLETED);
        booking.setUpdatedAt(LocalDateTime.now());
        booking.setActualEndDate(LocalDateTime.now());
        Booking updated = bookingRepository.save(booking);

        return convertToDTO(updated);
    }

    private BookingDTO convertToDTO(Booking booking) {
        Car car = booking.getCar();
        User carOwner = userRepository.findById(car.getIdUserCreated())
                .orElse(null);

        return BookingDTO.builder()
                .id(booking.getId())
                .bookingCode(booking.getBookingCode())
                .orderCode(booking.getOrderCode())
                .userId(booking.getUser().getId())
                .userFullName(booking.getUser().getFullName())
                .userEmail(booking.getUser().getEmail())
                .userPhoneNumber(booking.getUser().getPhoneNumber())
                .carId(car.getId())
                .carName(car.getName())
                .carBrand(car.getBrand())
                .carModel(car.getModel())
                .carLicensePlate(car.getLicensePlate())
                .carPricePerDay(car.getPricePerDay())
                .carOwnerId(carOwner != null ? carOwner.getId() : null)
                .carOwnerName(carOwner != null ? carOwner.getFullName() : null)
                .carOwnerPhone(carOwner != null ? carOwner.getPhoneNumber() : null)
                .carOwnerBankName(carOwner != null ? carOwner.getBankName() : null)
                .carOwnerBankAccountNumber(carOwner != null ? carOwner.getBankAccountNumber() : null)
                .carOwnerBankAccountName(carOwner != null ? carOwner.getBankAccountName() : null)
                .startDate(booking.getStartDate())
                .endDate(booking.getEndDate())
                .totalDays(booking.getTotalDays())
                .totalPrice(booking.getTotalPrice())
                .deposit(booking.getDeposit())
                .pickupLocation(booking.getPickupLocation())
                .dropoffLocation(booking.getDropoffLocation())
                .status(booking.getStatus())
                .notes(booking.getNotes())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
