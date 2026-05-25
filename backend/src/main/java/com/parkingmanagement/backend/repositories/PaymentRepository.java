package com.parkingmanagement.backend.repositories;

import com.parkingmanagement.backend.models.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
   Optional<Payment> findByReservationReservationId(String reservationId);
}
