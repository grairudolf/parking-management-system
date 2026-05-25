package com.parkingmanagement.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table( name = "receipts")
public class Receipt {

    @Id
    @Column(nullable = false)
    private String receiptId;

    @Column(nullable = false, unique = true)
    private String receiptNumber;

    @Column(nullable = false)
    private LocalDateTime issueDate;

    @Column(nullable = false)
    private double totalAmount;

    @OneToOne
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;
    
}
