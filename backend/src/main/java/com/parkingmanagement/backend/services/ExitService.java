package com.parkingmanagement.backend.services;

import com.parkingmanagement.backend.models.Entry;
import com.parkingmanagement.backend.models.Exit;
import com.parkingmanagement.backend.models.ParkingSpot;
import com.parkingmanagement.backend.repositories.ExitRepository;
import com.parkingmanagement.backend.repositories.ParkingSpotRepository;
import com.parkingmanagement.backend.repositories.EntryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
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

    public ExitService(ExitRepository exitRepository, EntryRepository entryRepository,
            ParkingSpotRepository parkingSpotRepository) {
        this.exitRepository = exitRepository;
        this.entryRepository = entryRepository;
        this.parkingSpotRepository = parkingSpotRepository;
    }

    public String verifyExit(String entryID) {
        Optional<Entry> optionalEntry = entryRepository.findById(entryID);

        if (optionalEntry.isEmpty()) {
            return "Error: Entry not found";
        }

        Entry entry = optionalEntry.get();

        Exit exit = new Exit();
        exit.setExitId(UUID.randomUUID().toString());

        LocalDateTime exitTime = LocalDateTime.now();
        exit.setExitTime(exitTime);

        long duration = Duration.between(entry.getEntryTime(), exitTime).toMinutes();
        // Set duration on Exit when supported by the model
        exit.setDuration(duration);

        exit.setEntry(entry);

        ParkingSpot spot = entry.getReservation().getParkingSpot();
        spot.freeSpot();
        parkingSpotRepository.save(spot);

        exitRepository.save(exit);

        return "Exit verified successfully";
    }
}
