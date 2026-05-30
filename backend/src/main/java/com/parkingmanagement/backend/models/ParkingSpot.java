package com.parkingmanagement.backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "parking_spots")
public class ParkingSpot {

    @Id
    @Column(name = "spot_id", nullable = false)
    private String spotId;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private boolean occupied;

    public void freeSpot() {
        this.occupied = false;
    }

    public void occupySpot() {
        this.occupied = true;
    }
}
