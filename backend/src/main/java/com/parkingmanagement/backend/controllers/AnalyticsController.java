package com.parkingmanagement.backend.controllers;

import com.parkingmanagement.backend.services.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8080", "http://127.0.0.1:8080"})
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/occupancy")
    public ResponseEntity<?> occupancy() {
        Map<String, Object> response = new HashMap<>();
        response.put("occupancyRate", analyticsService.getOccupancyRate());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/revenue")
    public ResponseEntity<?> revenue() {
        Map<String, Object> response = new HashMap<>();
        response.put("totalRevenue", analyticsService.getTotalRevenue());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/peak-hour")
    public ResponseEntity<?> peakHour() {
        Map<String, Object> response = new HashMap<>();
        response.put("peakHour", analyticsService.getPeakHour());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/summary")
    public ResponseEntity<?> summary() {
        Map<String, Object> response = new HashMap<>();
        response.put("occupancyRate", analyticsService.getOccupancyRate());
        response.put("totalRevenue", analyticsService.getTotalRevenue());
        response.put("peakHour", analyticsService.getPeakHour());
        return ResponseEntity.ok(response);
    }
}
