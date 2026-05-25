package com.parkingmanagement.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table( name = "exits")
public class Exit {
    @Id
    @Column(nullable = false)
    private String exitId;

    @Column(nullable = false)
    private LocalDateTime exitTime;

    @Column
    private int durationMinutes;

    @OneToOne
    @JoinColumn(name = "entry_id", nullable = false)
    private Entry entry;

    @ManyToOne 
    @JoinColumn(name = "gate_id")
    private Gate gate;
}