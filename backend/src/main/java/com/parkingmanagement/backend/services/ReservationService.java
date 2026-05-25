package com.parkingmanagement.backend.services;

import com.parkingmanagement.backend.models.Customer;
import com.parkingmanagement.backend.models.ParkingSpot;
import com.parkingmanagement.backend.models.Reservation;
import com.parkingmanagement.backend.repositories.ReservationRepository;
import com.parkingmanagement.backend.repositories.CustomerRepository;
import com.parkingmanagement.backend.repositories.ParkingSpotRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ParkingSpotRepository parkingSpotRepository;

    public String createReservation(String customerID, String spotID, LocalDate date, LocalTime time) {

        if (customerID == null || spotID == null) {
            return "Error: Customer ID and Spot ID are required.";
        }

        // Check if customer and spot exist
        Optional<Customer> customerOpt = customerRepository.findById(customerID);
        Optional<ParkingSpot> spotOpt = parkingSpotRepository.findById(spotID);

        if (customerOpt.isEmpty() || spotOpt.isEmpty()) {
            return "Error: Customer or Spot not found.";
        }

        ParkingSpot spot = spotOpt.get();

        // Check if spot is already occupied
        if (spot.isOccupied()) {
            return "Error: Parking spot is already occupied.";
        }

        // Create new reservation
        Reservation newReservation = new Reservation();
        newReservation.setReservationId(UUID.randomUUID().toString());
        newReservation.setCustomer(customerOpt.get());   // link the full Customer object
        newReservation.setParkingSpot(spot);             // link the full ParkingSpot object
        newReservation.setReservationDate(date.toString());
        newReservation.setReservationTime(time.toString());
        newReservation.setStatus("Confirmed");

        // Mark the spot as occupied (was commented out before — this is required)
        spot.occupySpot();

        // Save both
        parkingSpotRepository.save(spot);
        reservationRepository.save(newReservation);

        return "Reservation created successfully.";
    }

    public String cancelReservation(String reservationID) {
        if (reservationID == null) {
            return "Error: Reservation ID is required.";
        }

        Optional<Reservation> reservationOpt = reservationRepository.findById(reservationID);
        if (reservationOpt.isEmpty()) {
            return "Error: Reservation not found.";
        }

        Reservation reservation = reservationOpt.get();
        reservation.setStatus("Cancelled");

        // Free the parking spot via the linked object (not a raw String ID)
        ParkingSpot spot = reservation.getParkingSpot();
        if (spot != null) {
            spot.freeSpot();
            parkingSpotRepository.save(spot);
        }

        reservationRepository.save(reservation);
        return "Reservation cancelled successfully.";
    }
}
