package com.parkingmanagement.backend;

import com.parkingmanagement.backend.models.Customer;
import com.parkingmanagement.backend.models.ParkingSpot;
import com.parkingmanagement.backend.repositories.CustomerRepository;
import com.parkingmanagement.backend.repositories.ParkingSpotRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner seedDemoData(ParkingSpotRepository parkingSpotRepository, CustomerRepository customerRepository) {
		return args -> {
			if (parkingSpotRepository.count() == 0) {
				for (int i = 1; i <= 8; i++) {
					ParkingSpot spot = new ParkingSpot();
					spot.setSpotId("A" + String.format("%02d", i));
					spot.setLocation("Level 2 - North Wing");
					spot.setOccupied(false);
					parkingSpotRepository.save(spot);
				}

				for (int i = 1; i <= 4; i++) {
					ParkingSpot spot = new ParkingSpot();
					spot.setSpotId("B" + String.format("%02d", i));
					spot.setLocation("Level 2 - South Wing");
					spot.setOccupied(false);
					parkingSpotRepository.save(spot);
				}
			}

			if (!customerRepository.existsById("demo-customer")) {
				Customer customer = new Customer();
				customer.setCustomerId("demo-customer");
				customer.setName("Demo Customer");
				customer.setEmail("demo@parkcar.local");
				customer.setPassword("password");
				customer.setTelephone("0000000000");
				customerRepository.save(customer);
			}
		};
	}
}
