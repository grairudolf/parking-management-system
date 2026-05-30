package com.parkingmanagement.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "gates")
public class Gate {

    @Id
    @Column(name = "gate_id", nullable = false)
    private String gateId;

    @Column(name = "gate_number", nullable = false)
    private String gateNumber;

    @Column(name = "gate_type", nullable = false)
    private String gateType;

    @JsonIgnore
    @OneToMany(mappedBy = "gate")
    private List<SecurityGuard> securityGuards = new ArrayList<>();
}
