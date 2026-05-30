package com.parkingmanagement.backend.controllers;

import com.parkingmanagement.backend.repositories.EntryRepository;
import com.parkingmanagement.backend.services.EntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/entry")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class EntryController {

    @Autowired
    private EntryService entryService;

    @Autowired
    private EntryRepository entryRepository;

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> body) {
        String result = entryService.verifyEntry(body.get("plateNumber"), body.get("reservationID"));
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
        return ResponseEntity.ok(entryRepository.findAll());
    }
}
