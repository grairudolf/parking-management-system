package com.parkingmanagement.backend.controllers;

import com.parkingmanagement.backend.models.Customer;
import com.parkingmanagement.backend.models.Vehicle;
import com.parkingmanagement.backend.repositories.CustomerRepository;
import com.parkingmanagement.backend.repositories.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/vehicle")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody Map<String, String> body) {
        Customer customer = customerRepository.findById(body.get("customerId")).orElse(null);
        if (customer == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Customer not found.");
            return ResponseEntity.badRequest().body(response);
        }
        Vehicle vehicle = new Vehicle();
        vehicle.setVehicleId(UUID.randomUUID().toString());
        vehicle.setModel(body.get("model"));
        vehicle.setType(body.get("type"));
        vehicle.setPlateNumber(body.get("plateNumber"));
        vehicle.setCustomer(customer);
        vehicleRepository.save(vehicle);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("vehicleId", vehicle.getVehicleId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<?> all() {
        return ResponseEntity.ok(vehicleRepository.findAll());
    }
}
