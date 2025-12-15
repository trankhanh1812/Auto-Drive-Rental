package com.carrental.backend.service.user.impl;

import com.carrental.backend.dto.user.UserDTO;
import com.carrental.backend.dto.user.UserRegistrationDTO;
import com.carrental.backend.entity.User;
import com.carrental.backend.enums.UserRole;
import com.carrental.backend.enums.UserStatus;
import com.carrental.backend.repository.user.UserRepository;
import com.carrental.backend.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    public UserDTO registerUser(UserRegistrationDTO userRegistrationDTO) {
        if(userRepository.existsByEmail(userRegistrationDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
//        if(userRepository.existsByUsername(userRegistrationDTO.getUsername())) {
//            throw new RuntimeException("Username already exists");
//        }
        // create username frome email if not provided
        String username = userRegistrationDTO.getUsername();
        if (username == null || username.trim().isEmpty()) {
            username = userRegistrationDTO.getEmail().split("@")[0];
            // Add random suffix if username already exists
            int suffix = 1;
            String baseUsername = username;
            while (userRepository.existsByUsername(username)) {
                username = baseUsername + suffix;
                suffix++;
            }
        } else {
            if(userRepository.existsByUsername(username)) {
                throw new RuntimeException("Username already exists");
            }
        }

        if(userRepository.existsByPhoneNumber(userRegistrationDTO.getPhoneNumber())) {
            throw new RuntimeException("Phone number already exists");
        }

        UserRole role = userRegistrationDTO.getRole();
        if(role == null) {
            role = UserRole.USER;
        }
        User user = User.builder()
                .email(userRegistrationDTO.getEmail())
                //.username(userRegistrationDTO.getUsername())
                .username(username)
                .password(passwordEncoder.encode(userRegistrationDTO.getPassword()))
                .fullName(userRegistrationDTO.getFullName())
                .phoneNumber(userRegistrationDTO.getPhoneNumber())
                .idCardNumber(userRegistrationDTO.getCardNumber())
                .address(userRegistrationDTO.getAddress())
                .drivingLicense(userRegistrationDTO.getDrivingLicense())
                .status(UserStatus.ACTIVE)
                .role(role)
                //.role(userRegistrationDTO.getRole()) // them role owner
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .enabled(true)
                .build();
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDTO(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDTO(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(userDTO.getFullName());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setAddress(userDTO.getAddress());
        user.setDrivingLicense(userDTO.getDrivingLicense());
        user.setProfilePicture(userDTO.getProfilePicture());

        if(userDTO.getBankName() != null) {
            user.setBankName(userDTO.getBankName());
        }
        if(userDTO.getBankAccountNumber() != null) {
            user.setBankAccountNumber(userDTO.getBankAccountNumber());
        }
        if(userDTO.getBankAccountName() != null) {
            user.setBankAccountName(userDTO.getBankAccountName());
        }
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .profilePicture(user.getProfilePicture())
                .drivingLicense(user.getDrivingLicense())
                .bankName(user.getBankName())
                .bankAccountNumber(user.getBankAccountNumber())
                .bankAccountName(user.getBankAccountName())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .build();
    }
    @Override
    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public void updateUserProfilePicture(Long userId, String fileName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setProfilePicture(fileName);
        userRepository.save(user);
    }

    @Override
    public void updateUserDrivingLicenseImage(Long userId, String fileName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setDrivingLicense(fileName);
        userRepository.save(user);
    }
    @Override
    public UserDTO banUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setBanned(true);
        user.setEnabled(false);
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    @Override
    public UserDTO unbanUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setBanned(false);
        user.setEnabled(true);
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }
}

