package com.parkingmanagement.backend.services;

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
public class ReservationService{
      @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private CustomerRepository customerRepository;

        @Autowired
    private ParkingSpotRepository parkingspotRepository;

    public String createReservation(String customerID, String spotID, LocalDate date, LocalTime time){
         //Check If Customer Exist 
        var customerOpt = customerRepository.findById(customerID);
        var spotOpt = reservationRepository.findById(spotID);

         //Check If Customer or Spot is found
        if(customerOpt.isEmpty() || spotOpt.isEmpty()){
            return "Error, Customer or Spot Not Found";
        }

        Reservation spot = spotOpt.get();
        if (spot.isOccupied()) {
            return "Error: Parking spot is already occupied.";
        }


        //Create a new reservation object
        Reservation newReservation = new Reservation();
        newReservation.setReservationId(UUID.randomUUID().toString());
        newReservation.setSpotID(spotID);
        newReservation.setDate(date);
        newReservation.setTime(time);
        newReservation.setStatus("Confirmed");
        
        // spot.occupySpot();

        // Save to database
        reservationRepository.save(newReservation);
        parkingspotRepository.save(spot);

        return "Reservation Completed Successfully";
    }

    public String cancelReservation(String reservationID) {
        Optional<Reservation> reservationOpt = reservationRepository.findById(reservationID);
        if (reservationOpt.isEmpty()) {
            return "Error: Reservation not found.";
        }

        Reservation reservation = reservationOpt.get();
        reservation.setStatus("Cancelled");

        Optional<ParkingSpot> spotOpt = parkingspotRepository.findById(reservation.getSpotID());
        if (spotOpt.isPresent()) {
            ParkingSpot spot = spotOpt.get();
            spot.freeSpot();
            parkingspotRepository.save(spot);
        }

        reservationRepository.save(reservation);
        return "Reservation Cancelled Successfully";
    }
}