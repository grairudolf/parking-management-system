package com.parkingmanagement.backend.repositories;

import com.parkingmanagement.backend.models.Payment;
import com.parkingmanagement.backend.models.Reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {

    void save(Reservation spot);
   
}
