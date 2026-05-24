package com.parkingmanagement.backend.services;

import com.parkingmanagement.backend.models.Entry;
import com.parkingmanagement.backend.models.Reservation;
import com.parkingmanagement.backend.models.Vehicle;
import com.parkingmanagement.backend.repositories.VehicleRepository;
import com.parkingmanagement.backend.repositories.ReservationRepository;
import com.parkingmanagement.backend.repositories.EntryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

import java.time.LocalDateTime;
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
        Optional<Vehicle> vehicleOpt = vehicleRepository.findByPlateNumber(plateNumber);
        if (vehicleOpt.isEmpty()) {
            return "Error: Vehicle not found.";
        }

        Optional<Reservation> reservationOpt = reservationRepository.findById(reservationID);
        if (reservationOpt.isEmpty()) {
            return "Error: Reservation not found.";
        }

        Reservation reservation = reservationOpt.get();
        if (!"Confirmed".equalsIgnoreCase(reservation.getStatus())) {
            return "Error: Reservation is not confirmed.";
        }

        String uniqueID = UUID.randomUUID().toString();
        Entry entry = new Entry();
        entry.setId(uniqueID);
        entry.setEntryTime(LocalDateTime.now());
        entry.setVehicle(vehicleOpt.get());
        entry.setReservation(reservation);

        entryRepository.save(entry);
        return "Confirmation: Entry recorded successfully.";
    }

}