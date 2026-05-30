package com.parkingmanagement.backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "security_guards")
public class SecurityGuard {

    @Id
    @Column(name = "guard_id", nullable = false)
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
