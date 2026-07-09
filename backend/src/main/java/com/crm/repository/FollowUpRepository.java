package com.crm.repository;

import com.crm.entity.FollowUp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FollowUpRepository extends JpaRepository<FollowUp, Long> {
    
    List<FollowUp> findByLeadIdOrderByFollowUpDateDesc(Long leadId);

    List<FollowUp> findByFollowUpDate(LocalDate date);

    List<FollowUp> findByFollowUpDateBeforeAndStatusNot(LocalDate date, String status);

    List<FollowUp> findByFollowUpDateAfter(LocalDate date);

    List<FollowUp> findByFollowUpDateAndStatus(LocalDate date, String status);

    List<FollowUp> findByFollowUpDateBeforeAndStatus(LocalDate date, String status);

    List<FollowUp> findByFollowUpDateAfterAndStatus(LocalDate date, String status);
}
