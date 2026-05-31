package com.parkingmanagement.backend.controllers;

import com.parkingmanagement.backend.models.Payment;
import com.parkingmanagement.backend.services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8080", "http://127.0.0.1:8080"})
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/process")
    public ResponseEntity<?> process(@RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        String reservationId = (String) body.get("reservationId");
        String paymentMethod = (String) body.get("paymentMethod");
        if(reservationId == null || paymentMethod == null){
            response.put("success", false);
            response.put("message", "Reservation ID and payment method are required.");
            return ResponseEntity.badRequest().body(response);
        }

        if(body.get("amount") == null){
            response.put("success", false);
            response.put("message", "Amount is required.");
            return ResponseEntity.badRequest().body(response);
        }

        double amount = ((Number) body.get("amount")).doubleValue();
        try {
            Payment payment = paymentService.processPayment(reservationId, paymentMethod, amount);
            response.put("success", true);
            response.put("message", "Payment processed successfully.");
            response.put("paymentId", payment.getPaymentId());
            response.put("amount", payment.getAmount());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            response.put("success", false);
            response.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/by-reservation/{reservationId}")
    public ResponseEntity<?> byReservation(@PathVariable String reservationId) {
        Payment payment = paymentService.getPaymentByReservation(reservationId);
        if (payment == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "No payment found.");
            return ResponseEntity.status(404).body(response);
        } else {
            return ResponseEntity.ok(payment);
        }
    }
}
