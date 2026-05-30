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
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"})
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/process")
    public ResponseEntity<?> process(@RequestBody Map<String, Object> body) {
        String reservationId = (String) body.get("reservationId");
        String paymentMethod = (String) body.get("paymentMethod");
        double amount = ((Number) body.get("amount")).doubleValue();
        String result = paymentService.processPayment(reservationId, paymentMethod, amount);
        Map<String, Object> response = new HashMap<>();
        if (result.startsWith("Error:")) {
            response.put("success", false);
            response.put("message", result);
            return ResponseEntity.badRequest().body(response);
        } else {
            response.put("success", true);
            response.put("message", result);
            return ResponseEntity.ok(response);
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
