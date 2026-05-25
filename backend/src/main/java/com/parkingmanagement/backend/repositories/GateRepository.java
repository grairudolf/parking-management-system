package com.parkingmanagement.backend.repositories;

import com.parkingmanagement.backend.models.Gate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GateRepository extends JpaRepository<Gate, String>{
    
}