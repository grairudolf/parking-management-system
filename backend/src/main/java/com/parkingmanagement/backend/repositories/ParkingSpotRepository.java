package com.parkingmanagement.backend.repositories;

import com.parkingmanagement.backend.models.ParkingSpot;
import com.parkingmanagement.backend.models.Reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, String>{

    void save(Reservation spot);
    
}