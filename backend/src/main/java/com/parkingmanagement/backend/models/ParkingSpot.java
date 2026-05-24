package com.parkingmanagement.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "parking_spots")
public class ParkingSpot {

    // Attributes
    @Id
    @Column(nullable = false)
    private String spotId;
    @Column(nullable = false)
    private String location;
    @Column(nullable = false)
    private boolean occupied;
    public void freeSpot() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'freeSpot'");
    }

}
