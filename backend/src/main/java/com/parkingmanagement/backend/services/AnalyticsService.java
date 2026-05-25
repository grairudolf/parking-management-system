package com.parkingmanagement.backend.services;

import com.parkingmanagement.backend.models.Entry;
import com.parkingmanagement.backend.models.ParkingSpot;
import com.parkingmanagement.backend.models.Payment;
import com.parkingmanagement.backend.repositories.EntryRepository;
import com.parkingmanagement.backend.repositories.ParkingSpotRepository;
import com.parkingmanagement.backend.repositories.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private ParkingSpotRepository parkingSpotRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private EntryRepository entryRepository;

    // Fixed typo: getOcupancyRate -> getOccupancyRate
    public double getOccupancyRate() {
        List<ParkingSpot> allSpots = parkingSpotRepository.findAll();

        if (allSpots.isEmpty()) {
            return 0.0;
        }

        long occupiedCount = allSpots.stream().filter(ParkingSpot::isOccupied).count();
        return ((double) occupiedCount / allSpots.size()) * 100;
    }

    public double getTotalRevenue() {
        List<Payment> allPayments = paymentRepository.findAll();

        double total = 0.0;
        for (Payment payment : allPayments) {
            total += payment.getAmount();
        }
        return total;
    }

    public int getPeakHour() {
        List<Entry> allEntries = entryRepository.findAll();

        if (allEntries.isEmpty()) {
            return -1;
        }

        Map<Integer, Integer> hourCount = new HashMap<>();
        for (Entry entry : allEntries) {
            int hour = entry.getEntryTime().getHour();
            hourCount.put(hour, hourCount.getOrDefault(hour, 0) + 1);
        }

        int peakHour = -1;
        int maxCount = 0;
        for (Map.Entry<Integer, Integer> mapEntry : hourCount.entrySet()) {
            if (mapEntry.getValue() > maxCount) {
                maxCount = mapEntry.getValue();
                peakHour = mapEntry.getKey();
            }
        }
        return peakHour;
    }
}
