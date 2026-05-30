package com.parkingmanagement.backend.controllers;

import com.parkingmanagement.backend.models.Payment;
import com.parkingmanagement.backend.models.Receipt;
import com.parkingmanagement.backend.repositories.PaymentRepository;
import com.parkingmanagement.backend.repositories.ReceiptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/receipt")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ReceiptController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ReceiptRepository receiptRepository;

    @PostMapping("/generate")
    public ResponseEntity<?> generate(@RequestBody Map<String, String> body) {
        String paymentId = body.get("paymentId");
        Payment payment = paymentRepository.findById(paymentId).orElse(null);
        if (payment == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Payment not found.");
            return ResponseEntity.badRequest().body(response);
        }

        Receipt receipt = new Receipt();
        String receiptId = UUID.randomUUID().toString();
        receipt.setReceiptId(receiptId);
        receipt.setReceiptNumber("REC-" + receiptId.substring(0, 8));
        receipt.setIssueDate(LocalDateTime.now());
        receipt.setTotalAmount(payment.getAmount());
        receipt.setPayment(payment);
        receiptRepository.save(receipt);
        return ResponseEntity.ok(receipt);
    }

    @GetMapping("/all")
    public ResponseEntity<?> all() {
        return ResponseEntity.ok(receiptRepository.findAll());
    }
}
