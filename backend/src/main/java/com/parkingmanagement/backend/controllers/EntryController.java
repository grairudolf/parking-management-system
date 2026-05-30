package com.parkingmanagement.backend.controllers;

import com.parkingmanagement.backend.repositories.EntryRepository;
import com.parkingmanagement.backend.services.EntryService;
import com.parkingmanagement.backend.models.Entry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/entry")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8080", "http://127.0.0.1:8080"})
public class EntryController {

    @Autowired
    private EntryService entryService;

    @Autowired
    private EntryRepository entryRepository;

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            Entry entry = entryService.verifyEntry(body.get("plateNumber"), body.get("reservationID"));
            response.put("success", true);
            response.put("message", "Entry recorded successfully. Use this Entry ID when exiting.");
            response.put("entryId", entry.getEntryId());
            response.put("plateNumber", entry.getVehicle().getPlateNumber());
            response.put("spotId", entry.getReservation().getParkingSpot().getSpotId());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            response.put("success", false);
            response.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> all() {
        return ResponseEntity.ok(entryRepository.findAll());
    }
}
