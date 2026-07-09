package com.crm.repository;

import com.crm.entity.LeadType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LeadTypeRepository extends JpaRepository<LeadType, Long> {
    
    /**
     * Finds a lead type by its name.
     * @param leadTypeName the name to search for
     * @return an Optional containing the found lead type or empty
     */
    Optional<LeadType> findByLeadTypeName(String leadTypeName);

    /**
     * Checks if a lead type with the given name already exists.
     * @param leadTypeName the name to check
     * @return true if exists, false otherwise
     */
    boolean existsByLeadTypeName(String leadTypeName);
}
