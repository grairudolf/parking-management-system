package com.parkingmanagement.backend.models;

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

}
