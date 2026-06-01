package com.parkingmanagement.backend.controllers;

import com.parkingmanagement.backend.models.Receipt;
import com.parkingmanagement.backend.services.ReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/receipt")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8080", "http://127.0.0.1:8080"})
public class ReceiptController {

    // Bug fix: The original controller bypassed ReceiptService entirely, injecting
    // PaymentRepository and ReceiptRepository directly. That left ReceiptService as
    // a completely empty dead-code file. Now the controller correctly delegates to
    // ReceiptService, which owns all receipt business logic.
    @Autowired
    private ReceiptService receiptService;

    /**
     * POST /api/receipt/generate
     * Body: { "paymentId": "..." }
     *
     * Generates a receipt for the given payment. Idempotent — calling it twice
     * for the same payment returns the same receipt.
     */
    @PostMapping("/generate")
    public ResponseEntity<?> generate(@RequestBody Map<String, String> body) {
        String paymentId = body.get("paymentId");
        if (paymentId == null || paymentId.trim().isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Payment ID is required.");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            Receipt receipt = receiptService.generateReceipt(paymentId.trim());
            return ResponseEntity.ok(receipt);
        } catch (IllegalArgumentException ex) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * GET /api/receipt/verify/{receiptNumber}
     *
     * Validates a receipt number and returns the full receipt if it exists.
     */
    @GetMapping("/verify/{receiptNumber}")
    public ResponseEntity<?> verifyReceipt(@PathVariable String receiptNumber) {
        Receipt receipt = receiptService.getByReceiptNumber(receiptNumber);
        Map<String, Object> response = new HashMap<>();
        if (receipt == null) {
            response.put("valid", false);
            response.put("message", "Receipt number not found.");
            return ResponseEntity.status(404).body(response);
        }
        response.put("valid", true);
        response.put("message", "Receipt is valid.");
        response.put("receipt", receipt);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/receipt/all
     *
     * Returns all receipts in the system.
     */
    @GetMapping("/all")
    public ResponseEntity<?> all() {
        return ResponseEntity.ok(receiptService.getAllReceipts());
    }
}