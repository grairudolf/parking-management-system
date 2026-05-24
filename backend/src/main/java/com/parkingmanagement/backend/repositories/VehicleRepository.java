package com.parkingmanagement.backend.repositories;

import com.parkingmanagement.backend.models.Vehicle;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, String> {

    Optional<Vehicle> findByPlateNumber(String plateNumber);
    
}