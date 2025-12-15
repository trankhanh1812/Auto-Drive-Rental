package com.carrental.backend.repository.user.impl;

import com.carrental.backend.entity.User;
import com.carrental.backend.repository.user.UserRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

import java.util.Optional;

public class UserRepositoryImpl implements UserRepositoryCustom {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<User> findByPhoneNumberAndIdCardNumber(String phoneNumber, String idCardNumber) {
        StringBuilder sb = new StringBuilder();
        sb.append("""
                select u
                from User u
                where u.phoneNumber = :phoneNumber
                and u.idCardNumber = :idCardNumber
                """);
        Query query = entityManager.createNativeQuery(sb.toString());
        query.setParameter("phoneNumber", phoneNumber);
        query.setParameter("idCardNumber", idCardNumber);
        return Optional.ofNullable((User) query.getSingleResult());
    }
}
