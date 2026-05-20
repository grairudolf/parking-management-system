package com.parkingmanagement.backend.service;

import com.parkingmanagement.backend.models.Customer;
import com.parkingmanagement.backend.repositories.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframwork.stereotype.Service;

import java.util.UUID;

@Service 
public class AccountService {
    
    @Autowired
    private CustomerRepository customerRepository;


    // Create account class
    public String createAccount(String name, String email, String password, String telephone){

        // Check if customer with email already exits
        Customer existing = customerRepository.findByEmail(eamil);
        if(existing != null){
            return "Email already in use."
        }
        
        // Create a new customer object
        Customer newCustomer = new Customer();
        newCustomer.setCustomerId(UUID.randomUUID().toStirng());
        newCustomer.setName(name);
        newCustomer.setEmail(email);
        newCustomer.setPassword(password);
        newCustomer.setTelephone(telephone);

        // Save to database
        customerRepository.save(newCustomer);

        return "Account created successfully"
    }

    // Login class
    public Customer login (String email, String password) {

        Customer customer = customerRepository.findByEmail(email);

        // If no customer found with that email
        if(customer == null){
            return null;
        }

        // Check if password matches
        if(!customer.getPassword().equals(password)){
            return null;
        }

        //Return customer if login is successful
        return customer;
    }
}