package com.parkingmanagement.backend.repositories;

import com.parkingmanagement.backend.models.SecurityGuard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SecurityGuardRepository extends JpaRepository<SecurityGuard, String>{
    
}