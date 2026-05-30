package com.parkingmanagement.backend.repositories;

import com.parkingmanagement.backend.models.Exit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExitRepository extends JpaRepository<Exit, String>{
    boolean existsByEntryEntryId(String entryId);
}
