package com.parkingmanagement.backend.repositories;

import com.parkingmanagement.backend.models.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, String>{
    
}