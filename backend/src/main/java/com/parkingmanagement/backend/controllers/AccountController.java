package com.parkingmanagement.backend.controllers;

import com.parkingmanagement.backend.models.Customer;
import com.parkingmanagement.backend.services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/account")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"})
public class AccountController {

    @Autowired
    private AccountService accountService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String result = accountService.createAccount(body.get("name"), body.get("email"), body.get("password"), body.get("telephone"));
        Map<String, Object> response = new HashMap<>();
        if (result.contains("already")) {
            response.put("success", false);
            response.put("message", result);
            return ResponseEntity.badRequest().body(response);
        } else {
            response.put("success", true);
            response.put("message", result);
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        Customer c = accountService.login(body.get("email"), body.get("password"));
        Map<String, Object> response = new HashMap<>();
        if (c == null) {
            response.put("success", false);
            response.put("message", "Invalid credentials.");
            return ResponseEntity.status(401).body(response);
        } else {
            response.put("success", true);
            response.put("customerId", c.getCustomerId());
            response.put("name", c.getName());
            response.put("email", c.getEmail());
            return ResponseEntity.ok(response);
        }
    }
}
