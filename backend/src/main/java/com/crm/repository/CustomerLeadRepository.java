package com.crm.repository;

import com.crm.entity.CustomerLead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerLeadRepository extends JpaRepository<CustomerLead, Long>, JpaSpecificationExecutor<CustomerLead> {
    boolean existsByMobile(String mobile);
}
