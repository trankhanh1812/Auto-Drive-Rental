package com.carrental.backend.service.auth.impl;

import com.carrental.backend.dto.login.LoginRequestDTO;
import com.carrental.backend.dto.login.LoginResponseDTO;
import com.carrental.backend.dto.user.UserDTO;
import com.carrental.backend.dto.user.UserRegistrationDTO;
import com.carrental.backend.entity.User;
import com.carrental.backend.exception.ValidParametersException;
import com.carrental.backend.repository.user.UserRepository;
import com.carrental.backend.service.auth.AuthService;
import com.carrental.backend.service.user.UserService;
import com.carrental.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private AuthenticationManager authenticationManager;

    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
//        User user = userRepository.findByEmail(loginRequest.getEmail())
//                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
//        if(!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
//            throw new RuntimeException("Invalid email or password");
//        }
        String loginIdentifier = loginRequest.getUsername();
        if(loginIdentifier == null || loginIdentifier.trim().isEmpty()) {
            loginIdentifier = loginRequest.getEmail();
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginIdentifier,
                        loginRequest.getPassword()
                )
        );
        //System.out.println("Principal class: " + authentication.getPrincipal().getClass());

        User user = (User) authentication.getPrincipal();

        String token = jwtUtil.generateToken(user);

        UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .drivingLicense(user.getDrivingLicense())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .build();

        return LoginResponseDTO.builder()
                .token(token)
                .type("Bearer")
                .user(userDTO)
                .build();
    }
//    private String generateToken(User user) {
//        return "Bearer_" + user.getId() + "_" + System.currentTimeMillis();
//    }

    public UserDTO register(UserRegistrationDTO userRegistrationDTO) {
        return userService.registerUser(userRegistrationDTO);
    }

}
