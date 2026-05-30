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

    public Entry verifyEntry(String plateNumber, String reservationID) {

        if(plateNumber == null || reservationID == null){
            throw new IllegalArgumentException("Plate number and Reservation ID are required.");
        }
        
        // Find vehicle by plate number
        Optional<Vehicle> vehicleOpt = vehicleRepository.findByPlateNumber(plateNumber);
        if (vehicleOpt.isEmpty()) {
            throw new IllegalArgumentException("Vehicle not found. Add the vehicle before gate verification.");
        }

        // Find reservation
        Optional<Reservation> reservationOpt = reservationRepository.findById(reservationID);
        if (reservationOpt.isEmpty()) {
            throw new IllegalArgumentException("Reservation not found.");
        }

        Reservation reservation = reservationOpt.get();

        // Reservation must be Confirmed
        if (!"Confirmed".equalsIgnoreCase(reservation.getStatus())) {
            throw new IllegalArgumentException("Reservation is not confirmed.");
        }

        if (!reservation.getCustomer().getCustomerId().equals(vehicleOpt.get().getCustomer().getCustomerId())) {
            throw new IllegalArgumentException("Vehicle does not belong to the reservation customer.");
        }

        if (entryRepository.existsByReservationReservationId(reservationID)) {
            throw new IllegalArgumentException("This reservation has already been used for entry.");
        }

        // Create entry record
        Entry entry = new Entry();
        entry.setEntryId(UUID.randomUUID().toString());  // correct field name: entryId
        entry.setEntryTime(LocalDateTime.now());
        entry.setVehicle(vehicleOpt.get());
        entry.setReservation(reservation);

        return entryRepository.save(entry);
    }
}
