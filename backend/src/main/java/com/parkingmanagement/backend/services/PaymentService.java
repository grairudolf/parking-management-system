package com.parkingmanagement.backend.services;

import com.parkingmanagement.backend.models.Payment;
import com.parkingmanagement.backend.models.Reservation;
import com.parkingmanagement.backend.repositories.PaymentRepository;
import com.parkingmanagement.backend.repositories.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.Optional;

@Service
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    public String processPayment(String reservationId, String paymentMethod, double amount){

        // Check if reservation exists
        Optional<Reservation> optional = reservationRepository.findById(reservationId);
        if(optional.isEmpty()){
            return "Reservation not found.";
        }

        Reservation reservation = optional.get();

        if (reservation.getStatus().equals("Cancelled")){
            return "Cannot process payment for cancelled reservation";
        }

        // Create a new payment object
        Payment newPayment = new Payment();
        newPayment.setPaymentId(UUID.randomUUID().toString());
        newPayment.setAmount(amount);
        newPayment.setReservation(reservation);
        newPayment.setPaymentMethod(paymentMethod);
        newPayment.setPaymentStatus("Paid");

        // Save to database
        paymentRepository.save(newPayment);

        return "Payment processed successfully";
    }

    public Payment getPaymentByReservation(String reservationId){
        Optional<Reservation> optional = reservationRepository.findById(reservationId);

        if(optional.isEmpty()){
            return null;
        }

        // TODO: find payment linked to this reservation
        return null;
    }

}

