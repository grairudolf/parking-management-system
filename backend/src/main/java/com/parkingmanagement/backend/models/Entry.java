package com.parkingmanagement.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "entries")
public class Entry {

    @Id
    @Column(name = "entry_id", nullable = false)
    private String entryId;

    @Column(name = "entry_time", nullable = false)
    private LocalDateTime entryTime;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    @JsonIgnoreProperties({"customer"})
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name = "reservation_id", nullable = false)
    @JsonIgnoreProperties({"customer.vehicles", "customer.reservations"})
    private Reservation reservation;

    @ManyToOne
    @JoinColumn(name = "gate_id")
    @JsonIgnoreProperties({"securityGuards"})
    private Gate gate;
}
