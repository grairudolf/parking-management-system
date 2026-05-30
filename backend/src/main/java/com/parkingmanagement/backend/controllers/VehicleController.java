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
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8080", "http://127.0.0.1:8080"})
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody Map<String, String> body) {
        Customer customer = customerRepository.findById(body.get("customerId")).orElse(null);
        if (customer == null) {
            customer = new Customer();
            customer.setCustomerId(body.get("customerId"));
            customer.setName("Guest Customer");
            customer.setEmail(body.get("customerId") + "@parkcar.local");
            customer.setPassword("password");
            customer.setTelephone("0000000000");
            customerRepository.save(customer);
        }
        Vehicle existing = vehicleRepository.findByPlateNumber(body.get("plateNumber")).orElse(null);
        if (existing != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("vehicleId", existing.getVehicleId());
            response.put("message", "Vehicle already exists.");
            return ResponseEntity.ok(response);
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
