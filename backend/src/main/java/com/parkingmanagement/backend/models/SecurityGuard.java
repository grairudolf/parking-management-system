package com.parkingmanagement.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "security_guards")
public class SecurityGuard {

    @Id
    @Column(nullable = false)
    private String guardId;

    @Column(nullable = false)
    private String name;

    @Column
    private String phone;

    @Column
    private String role;

    @ManyToOne
    @JoinColumn(name = "gate_id")
    private Gate gate;
}

