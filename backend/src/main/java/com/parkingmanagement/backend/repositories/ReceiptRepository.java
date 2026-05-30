package com.parkingmanagement.backend.repositories;

import com.parkingmanagement.backend.models.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, String>{
    java.util.Optional<Receipt> findByPaymentPaymentId(String paymentId);
    java.util.Optional<Receipt> findByReceiptNumber(String receiptNumber);
}
