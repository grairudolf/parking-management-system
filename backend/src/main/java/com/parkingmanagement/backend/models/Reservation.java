package com.parkingmanagement.backend.models;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reservations")
public class Reservation {

    // Attributes
    @Id
    @Column(nullable = false)
    private String reservationId;
    @Column(nullable = false)
    private String reservationDate;
    @Column(nullable = false)
    private String reservationTime;
    @Column(nullable = false)
    private String status;

    // Relationships
    private Customer customer;
    private Vehicle vehicle;
    private ParkingSpot parkingSpot;
    public void setspotID(String spotID) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setspotID'");
    }
    public boolean isOccupied() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'isOccupied'");
    }
    public void setTime(String time) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setTime'");
    }
    public void setDate(String date) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setDate'");
    }
    public void setSpotID(String spotID) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setSpotID'");
    }
    public void setDate(LocalDate date) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setDate'");
    }
    public void setTime(LocalTime time) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setTime'");
    }
    public void occupySpot() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'occupySpot'");
    }
    public String getSpotID() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getSpotID'");
    }

}
