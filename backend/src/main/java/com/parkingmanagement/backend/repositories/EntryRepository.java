package com.parkingmanagement.backend.repositories;

import com.parkingmanagement.backend.models.Entry;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntryRepository extends JpaRepository<Entry, String> {
}
