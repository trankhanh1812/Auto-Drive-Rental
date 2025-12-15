package com.carrental.backend.controller;

import com.carrental.backend.dto.ApiResponse;
import com.carrental.backend.dto.user.UserDTO;
import com.carrental.backend.dto.user.UserRegistrationDTO;
import com.carrental.backend.service.file.FileStorageService;
import com.carrental.backend.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private FileStorageService fileStorageService;

//    @PostMapping("/register")
//    public ResponseEntity<ApiResponse<UserDTO>> registerUser(
//            @Valid @RequestBody UserRegistrationDTO registrationDTO) {
//        UserDTO user = userService.registerUser(registrationDTO);
//        return ResponseEntity.status(HttpStatus.CREATED)
//                .body(ApiResponse.success("User registered successfully", user));
//    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> getUserById(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<UserDTO>> getUserByEmail(@PathVariable String email) {
        UserDTO user = userService.getUserByEmail(email);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> updateUser(
            @PathVariable Long id,
            @RequestBody UserDTO userDTO) {
        UserDTO updatedUser = userService.updateUser(id, userDTO);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updatedUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUserProfile() {
        UserDTO user =  userService.getUserById(userService.getCurrentUser().getId());
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserDTO>> updateCurrentUserProfile(
            @RequestBody UserDTO userDTO
    ) {
        Long currentUserId = userService.getCurrentUser().getId();
        UserDTO updatedUser = userService.updateUser(currentUserId, userDTO);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updatedUser));
    }

    @PostMapping("/profile/avatar")
    @PreAuthorize("isAuthenticated()")
    public  ResponseEntity<ApiResponse<String>> uploadAvatar(
            @RequestParam("file") MultipartFile file
            ) {
        String fileUrl = fileStorageService.uploadFile(file, "avatars");
        Long currentUserId = userService.getCurrentUser().getId();
        //update user profile picture
        userService.updateUserProfilePicture(currentUserId, fileUrl);
        return ResponseEntity.ok(ApiResponse.success("Avatar uploaded successfully", fileUrl));
    }

    @PostMapping("/profile/driving-license")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<String>> uploadDrivingLicense(
            @RequestParam("file") MultipartFile file) {
        String fileUrl = fileStorageService.uploadFile(file, "licenses");
        Long currentUserId = userService.getCurrentUser().getId();
        userService.updateUserDrivingLicenseImage(currentUserId, fileUrl);
        return ResponseEntity.ok(ApiResponse.success("Driving license uploaded successfully", fileUrl));
    }
}
