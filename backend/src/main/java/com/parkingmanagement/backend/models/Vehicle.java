package com.parkingmanagement.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "vehicles")
public class Vehicle {

    // Attributes
    @Id
    @Column(nullable = false)
    private String vehicleId;
    @Column(nullable = false)
    private String model;
    @Column(nullable = false)
    private String type;
    @Column(nullable = false)
    private String plateNumber;

    // Relationship
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

}