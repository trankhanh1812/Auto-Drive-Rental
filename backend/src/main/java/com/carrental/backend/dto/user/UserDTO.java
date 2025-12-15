package com.carrental.backend.dto.user;

import com.carrental.backend.enums.UserRole;
import com.carrental.backend.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String email;
    private String username;
    private String fullName;
    private String phoneNumber;
    private String bankName;
    private String bankAccountNumber;
    private String bankAccountName;
    private String address;
    private String drivingLicense;
    private String profilePicture;
    private UserRole role;
    private UserStatus status;
    private LocalDateTime createdAt;
}
