package com.parkingmanagement.backend.controllers;

import com.parkingmanagement.backend.models.Exit;
import com.parkingmanagement.backend.repositories.ExitRepository;
import com.parkingmanagement.backend.services.ExitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/exit")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8080", "http://127.0.0.1:8080"})
public class ExitController {

    // Bug fix: The original ExitController completely reimplemented exit logic inline
    // and never used ExitService at all. ExitService was broken (called exit.setDuration()
    // which doesn't exist) and unreachable. Now the controller delegates to ExitService,
    // which has been fixed to use setDurationMinutes(int) correctly.
    @Autowired
    private ExitService exitService;

    @Autowired
    private ExitRepository exitRepository;

    /**
     * POST /api/exit/verify
     * Body: { "entryId": "..." }
     *
     * Records an exit for the given entry, calculates duration, frees the parking spot,
     * and marks the entry ID as consumed so it cannot be reused.
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> body) {
        String entryId = body.get("entryId");
        Map<String, Object> response = new HashMap<>();

        if (entryId == null || entryId.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Entry ID is required.");
            return ResponseEntity.badRequest().body(response);
        }

        String result = exitService.verifyExit(entryId.trim());

        if (result.startsWith("Error:")) {
            response.put("success", false);
            response.put("message", result);
            return ResponseEntity.badRequest().body(response);
        }

        // Fetch the saved exit to return its data in the response
        Exit exit = exitRepository.findAll().stream()
                .filter(e -> e.getEntry() != null && e.getEntry().getEntryId().equals(entryId.trim()))
                .findFirst()
                .orElse(null);

        response.put("success", true);
        response.put("message", result);
        if (exit != null) {
            response.put("exitId", exit.getExitId());
            response.put("durationMinutes", exit.getDurationMinutes());
        }
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/exit/all
     *
     * Returns all recorded exits.
     */
    @GetMapping("/all")
    public ResponseEntity<?> all() {
        return ResponseEntity.ok(exitRepository.findAll());
    }
}