package com.parkingmanagement.backend.repositories;

import com.parkingmanagement.backend.models.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface CustomerReposotory extends JpaRepository<Customer, String>{

}