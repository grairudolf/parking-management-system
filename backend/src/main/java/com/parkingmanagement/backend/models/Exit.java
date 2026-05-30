package com.parkingmanagement.backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "exits")
public class Exit {

    @Id
    @Column(name = "exit_id", nullable = false)
    private String exitId;

    @Column(name = "exit_time", nullable = false)
    private LocalDateTime exitTime;

    @Column(name = "duration_minutes")
    private int durationMinutes;

    @OneToOne
    @JoinColumn(name = "entry_id", nullable = false)
    private Entry entry;

    @ManyToOne
    @JoinColumn(name = "gate_id")
    private Gate gate;
}
