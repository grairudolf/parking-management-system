package com.parkingmanagement.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "gate")
public class Gate {
    @Id
    @Column(nullable = false)
    private String gateId;

    @Column(nullable = false)
    private String gateNumber;

    @Column(nullable = false)
    private String gatetype; // Entry or Exit
}