package com.parkingmanagement.backend.services;

import com.parkingmanagement.backend.models.Payment;
import com.parkingmanagement.backend.models.Receipt;
import com.parkingmanagement.backend.repositories.PaymentRepository;
import com.parkingmanagement.backend.repositories.ReceiptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ReceiptService {

    @Autowired
    private ReceiptRepository receiptRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    /**
     * Generates a receipt for a given paymentId.
     * If a receipt already exists for this payment, it returns the existing one (idempotent).
     *
     * @param paymentId the ID of the payment to generate a receipt for
     * @return the generated (or existing) Receipt
     * @throws IllegalArgumentException if the payment is not found
     */
    public Receipt generateReceipt(String paymentId) {
        if (paymentId == null || paymentId.trim().isEmpty()) {
            throw new IllegalArgumentException("Payment ID is required.");
        }

        Payment payment = paymentRepository.findById(paymentId.trim())
                .orElseThrow(() -> new IllegalArgumentException("Payment not found for ID: " + paymentId));

        // Idempotency: return existing receipt if one already exists for this payment
        Optional<Receipt> existing = receiptRepository.findByPaymentPaymentId(paymentId);
        if (existing.isPresent()) {
            return existing.get();
        }

        String receiptId = UUID.randomUUID().toString();

        Receipt receipt = new Receipt();
        receipt.setReceiptId(receiptId);
        receipt.setReceiptNumber("REC-" + receiptId.substring(0, 8).toUpperCase());
        receipt.setIssueDate(LocalDateTime.now());
        receipt.setTotalAmount(payment.getAmount());
        receipt.setPayment(payment);

        return receiptRepository.save(receipt);
    }

    /**
     * Retrieves a receipt by its human-readable receipt number (e.g. "REC-A1B2C3D4").
     *
     * @param receiptNumber the receipt number to look up
     * @return the Receipt if found, or null
     */
    public Receipt getByReceiptNumber(String receiptNumber) {
        if (receiptNumber == null || receiptNumber.trim().isEmpty()) {
            return null;
        }
        return receiptRepository.findByReceiptNumber(receiptNumber.trim()).orElse(null);
    }

    /**
     * Retrieves the receipt associated with a given payment ID.
     *
     * @param paymentId the payment ID
     * @return the Receipt if found, or null
     */
    public Receipt getByPaymentId(String paymentId) {
        if (paymentId == null || paymentId.trim().isEmpty()) {
            return null;
        }
        return receiptRepository.findByPaymentPaymentId(paymentId).orElse(null);
    }

    /**
     * Returns all receipts in the system.
     */
    public List<Receipt> getAllReceipts() {
        return receiptRepository.findAll();
    }
}