package com.parkingmanagement.backend.controllers;

import com.parkingmanagement.backend.models.Reservation;
import com.parkingmanagement.backend.repositories.ReservationRepository;
import com.parkingmanagement.backend.services.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservation")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8080", "http://127.0.0.1:8080"})
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private ReservationRepository reservationRepository;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Map<String, String> body) {
        String result = reservationService.createReservation(body.get("customerID"), body.get("spotID"), LocalDate.parse(body.get("date")), LocalTime.parse(body.get("time")));
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

    @PostMapping("/cancel")
    public ResponseEntity<?> cancel(@RequestBody Map<String, String> body) {
        String result = reservationService.cancelReservation(body.get("reservationID"));
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

    @GetMapping("/all")
    public ResponseEntity<?> all() {
        return ResponseEntity.ok(reservationRepository.findAll());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> customerReservations(@PathVariable String customerId) {
        return ResponseEntity.ok(reservationRepository.findAll().stream()
                .filter(r -> r.getCustomer() != null && r.getCustomer().getCustomerId().equals(customerId))
                .collect(Collectors.toList()));
    }
}
