package com.carrental.backend.controller;

import com.carrental.backend.dto.ApiResponse;
import com.carrental.backend.dto.car.CarDTO;
import com.carrental.backend.dto.user.UserDTO;
import com.carrental.backend.entity.User;
import com.carrental.backend.enums.UserRole;
import com.carrental.backend.service.car.CarService;
import com.carrental.backend.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private CarService carService;

    @GetMapping("/cars/pending")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<List<CarDTO>>> getPendingCars() {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != UserRole.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied. Admin role required."));
        }

        List<CarDTO> pendingCars = carService.getPendingCars();
        return ResponseEntity.ok(ApiResponse.success("Pending cars", pendingCars));
    }

    @PutMapping("/cars/{id}/approve")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<CarDTO>> approveCar(@PathVariable Long id) {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != UserRole.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied. Admin role required."));
        }

        CarDTO car = carService.approveCar(id);
        return ResponseEntity.ok(ApiResponse.success("Car approved successfully", car));
    }

    @PutMapping("/cars/{id}/reject")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> rejectCar(
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != UserRole.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied. Admin role required."));
        }

        carService.rejectCar(id, reason);
        return ResponseEntity.ok(ApiResponse.success("Car rejected", null));
    }

    // User Management
    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != UserRole.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied. Admin role required."));
        }

        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("All users", users));
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<UserDTO>> getUserById(@PathVariable Long id) {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != UserRole.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied. Admin role required."));
        }

        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("User details", user));
    }

    @PutMapping("/users/{id}/ban")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<UserDTO>> banUser(@PathVariable Long id) {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != UserRole.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied. Admin role required."));
        }

        UserDTO user = userService.banUser(id);
        return ResponseEntity.ok(ApiResponse.success("User banned successfully", user));
    }

    @PutMapping("/users/{id}/unban")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<UserDTO>> unbanUser(@PathVariable Long id) {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != UserRole.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied. Admin role required."));
        }

        UserDTO user = userService.unbanUser(id);
        return ResponseEntity.ok(ApiResponse.success("User unbanned successfully", user));
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != UserRole.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied. Admin role required."));
        }

        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }
    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminStats() {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != UserRole.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied. Admin role required."));
        }

        Map<String, Object> stats = new HashMap<>();

        // Count pending cars
        List<CarDTO> pendingCars = carService.getPendingCars();
        stats.put("pendingCarsCount", pendingCars.size());

        // Count total users
        List<UserDTO> users = userService.getAllUsers();
        stats.put("totalUsersCount", users.size());

        // Count complaints (placeholder for now)
        stats.put("complaintsCount", 0);

        return ResponseEntity.ok(ApiResponse.success("Admin statistics", stats));
    }
}
