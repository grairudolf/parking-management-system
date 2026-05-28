package com.parkingmanagement.backend.controllers;

import com.parkingmanagement.backend.models.Entry;
import com.parkingmanagement.backend.models.Exit;
import com.parkingmanagement.backend.models.ParkingSpot;
import com.parkingmanagement.backend.repositories.EntryRepository;
import com.parkingmanagement.backend.repositories.ExitRepository;
import com.parkingmanagement.backend.repositories.ParkingSpotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/exit")
@CrossOrigin(origins = "http://localhost:3000")
public class ExitController {

    @Autowired
    private EntryRepository entryRepository;

    @Autowired
    private ExitRepository exitRepository;

    @Autowired
    private ParkingSpotRepository parkingSpotRepository;

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> body) {
        Entry entry = entryRepository.findById(body.get("entryId")).orElse(null);
        if (entry == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Entry not found.");
            return ResponseEntity.badRequest().body(response);
        }
        LocalDateTime exitTime = LocalDateTime.now();
        int duration = (int) ChronoUnit.MINUTES.between(entry.getEntryTime(), exitTime);
        Exit exit = new Exit();
        exit.setExitId(UUID.randomUUID().toString());
        exit.setExitTime(exitTime);
        exit.setDurationMinutes(duration);
        exit.setEntry(entry);
        
        ParkingSpot spot = entry.getReservation().getParkingSpot();
        if (spot != null) {
            spot.freeSpot();
            parkingSpotRepository.save(spot);
        }
        exitRepository.save(exit);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("exitId", exit.getExitId());
        response.put("durationMinutes", exit.getDurationMinutes());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<?> all() {
        return ResponseEntity.ok(exitRepository.findAll());
    }
}
