package com.parkingmanagement.backend.services;

import com.parkingmanagement.backend.models.Entry;
import com.parkingmanagement.backend.models.Reservation;
import com.parkingmanagement.backend.models.Vehicle;
import com.parkingmanagement.backend.repositories.VehicleRepository;
import com.parkingmanagement.backend.repositories.ReservationRepository;
import com.parkingmanagement.backend.repositories.EntryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class EntryService {

    @Autowired
    private EntryRepository entryRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    public String verifyEntry(String plateNumber, String reservationID) {

        if(plateNumber == null || reservationID == null){
            return "Error: Plate number and Reservation ID are required";
        }
        
        // Find vehicle by plate number
        Optional<Vehicle> vehicleOpt = vehicleRepository.findByPlateNumber(plateNumber);
        if (vehicleOpt.isEmpty()) {
            return "Error: Vehicle not found.";
        }

        // Find reservation
        Optional<Reservation> reservationOpt = reservationRepository.findById(reservationID);
        if (reservationOpt.isEmpty()) {
            return "Error: Reservation not found.";
        }

        Reservation reservation = reservationOpt.get();

        // Reservation must be Confirmed
        if (!"Confirmed".equalsIgnoreCase(reservation.getStatus())) {
            return "Error: Reservation is not confirmed.";
        }

        // Create entry record
        Entry entry = new Entry();
        entry.setEntryId(UUID.randomUUID().toString());  // correct field name: entryId
        entry.setEntryTime(LocalDateTime.now());
        entry.setVehicle(vehicleOpt.get());
        entry.setReservation(reservation);

        entryRepository.save(entry);
        return "Entry recorded successfully.";
    }
}
