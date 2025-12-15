package com.carrental.backend.repository.user;

import com.carrental.backend.entity.User;

import java.util.Optional;

public interface UserRepositoryCustom {
    Optional<User> findByPhoneNumberAndIdCardNumber(String phoneNumber, String idCardNumber);
}
