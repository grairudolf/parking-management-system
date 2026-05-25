package com.parkingmanagement.backend.services;

import com.parkingmanagement.backend.models.Payment;
import com.parkingmanagement.backend.models.Reservation;
import com.parkingmanagement.backend.repositories.PaymentRepository;
import com.parkingmanagement.backend.repositories.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    public String processPayment(String reservationId, String paymentMethod, double amount) {

        if (reservationId == null || paymentMethod == null) {
            return "Error: Reservation ID and payment method are required.";
        }

        Optional<Reservation> optional = reservationRepository.findById(reservationId);
        if (optional.isEmpty()) {
            return "Error: Reservation not found.";
        }

        Reservation reservation = optional.get();

        if ("Cancelled".equalsIgnoreCase(reservation.getStatus())) {
            return "Error: Cannot process payment for a cancelled reservation.";
        }

        Payment newPayment = new Payment();
        newPayment.setPaymentId(UUID.randomUUID().toString());
        newPayment.setAmount(amount);
        newPayment.setReservation(reservation);
        newPayment.setPaymentMethod(paymentMethod);
        newPayment.setPaymentStatus("Paid");

        paymentRepository.save(newPayment);
        return "Payment processed successfully.";
    }

    public Payment getPaymentByReservation(String reservationId) {
        // Uses the new repository method findByReservationReservationId
        return paymentRepository.findByReservationReservationId(reservationId).orElse(null);
    }
}
