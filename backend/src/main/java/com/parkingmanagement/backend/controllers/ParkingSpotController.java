package com.parkingmanagement.backend.controllers;

import com.parkingmanagement.backend.models.ParkingSpot;
import com.parkingmanagement.backend.repositories.ParkingSpotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/spots")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"})
public class ParkingSpotController {

    @Autowired
    private ParkingSpotRepository parkingSpotRepository;

    @GetMapping("/all")
    public ResponseEntity<?> all() {
        return ResponseEntity.ok(parkingSpotRepository.findAll());
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody Map<String, String> body) {
        ParkingSpot spot = new ParkingSpot();
        spot.setSpotId(body.get("spotId"));
        spot.setLocation(body.get("location"));
        spot.setOccupied(false);
        parkingSpotRepository.save(spot);
        return ResponseEntity.ok(spot);
    }
}
