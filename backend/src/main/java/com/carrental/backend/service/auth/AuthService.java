package com.carrental.backend.service.auth;

import com.carrental.backend.dto.login.LoginRequestDTO;
import com.carrental.backend.dto.login.LoginResponseDTO;
import com.carrental.backend.dto.user.UserDTO;
import com.carrental.backend.dto.user.UserRegistrationDTO;

public interface AuthService {
    LoginResponseDTO login(LoginRequestDTO loginRequestDTO);
    UserDTO register(UserRegistrationDTO userRegistrationDTO);
}
