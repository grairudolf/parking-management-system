package com.parkingmanagement.backend.services;

import com.parkingmanagement.backend.models.Entry;
import com.parkingmanagement.backend.models.Exit;
import com.parkingmanagement.backend.models.ParkingSpot;
import com.parkingmanagement.backend.repositories.ExitRepository;
import com.parkingmanagement.backend.repositories.ParkingSpotRepository;
import com.parkingmanagement.backend.repositories.EntryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
public class ExitService {

    @Autowired
    private ExitRepository exitRepository;

    @Autowired
    private EntryRepository entryRepository;

    @Autowired
    private ParkingSpotRepository parkingSpotRepository;

    // Bug fix #1: Removed the manual constructor that conflicted with @Autowired field injection.
    // Spring would inject fields via @Autowired, but the constructor was also injecting
    // them — the constructor ran *before* Spring's field injection, so the constructor
    // assignments were immediately overwritten with null by the field injector.
    // The correct Spring pattern is to use @Autowired on fields (as above) or on the
    // constructor (not both). Since the controller now owns the exit logic, this service
    // is kept lean and uses field injection consistently.

    public String verifyExit(String entryID) {
        if (entryID == null || entryID.trim().isEmpty()) {
            return "Error: Entry ID is required.";
        }

        Optional<Entry> optionalEntry = entryRepository.findById(entryID.trim());
        if (optionalEntry.isEmpty()) {
            return "Error: Entry not found.";
        }

        Entry entry = optionalEntry.get();

        // Guard: prevent double-exit on the same entry
        if (exitRepository.existsByEntryEntryId(entry.getEntryId())) {
            return "Error: Exit already recorded for this entry.";
        }

        LocalDateTime exitTime = LocalDateTime.now();

        // Bug fix #2: The original code called exit.setDuration(long), which does not
        // exist on the Exit model. The correct field is durationMinutes (int).
        // ChronoUnit.MINUTES.between returns a long; we cast to int safely since no
        // real parking session will exceed Integer.MAX_VALUE minutes (~4000 years).
        int durationMinutes = (int) ChronoUnit.MINUTES.between(entry.getEntryTime(), exitTime);

        Exit exit = new Exit();
        exit.setExitId(UUID.randomUUID().toString());
        exit.setExitTime(exitTime);
        exit.setDurationMinutes(durationMinutes); // was: exit.setDuration(duration) — compile error
        exit.setEntry(entry);

        // Free the parking spot
        ParkingSpot spot = entry.getReservation().getParkingSpot();
        if (spot != null) {
            spot.freeSpot();
            parkingSpotRepository.save(spot);
        }

        exitRepository.save(exit);

        return "Exit verified successfully. Duration: " + durationMinutes + " minutes.";
    }
}