package com.carrental.backend.service.user;

import com.carrental.backend.dto.user.UserDTO;
import com.carrental.backend.dto.user.UserRegistrationDTO;
import com.carrental.backend.entity.User;

import java.util.List;

public interface UserService {
    UserDTO registerUser(UserRegistrationDTO userRegistrationDTO);
    UserDTO getUserById(Long userId);
    UserDTO getUserByEmail(String email);
    List<UserDTO> getAllUsers();
    UserDTO updateUser(Long userId, UserDTO userDTO);
    void deleteUser(Long userId);
    User getCurrentUser();

    void updateUserProfilePicture(Long currentUserId, String fileUrl);

    void updateUserDrivingLicenseImage(Long currentUserId, String fileUrl);

    UserDTO banUser(Long userId);
    UserDTO unbanUser(Long userId);
}
