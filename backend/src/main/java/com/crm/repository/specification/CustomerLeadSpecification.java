package com.crm.repository.specification;

import com.crm.dto.LeadSearchRequestDTO;
import com.crm.entity.CustomerLead;
import com.crm.entity.LeadType;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class CustomerLeadSpecification {

    public static Specification<CustomerLead> filterBy(LeadSearchRequestDTO criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (criteria.getCustomerName() != null && !criteria.getCustomerName().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("customerName")), "%" + criteria.getCustomerName().toLowerCase() + "%"));
            }

            if (criteria.getMobile() != null && !criteria.getMobile().isEmpty()) {
                predicates.add(cb.like(root.get("mobile"), "%" + criteria.getMobile() + "%"));
            }

            if (criteria.getCity() != null && !criteria.getCity().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("city")), "%" + criteria.getCity().toLowerCase() + "%"));
            }

            if (criteria.getLeadTypeId() != null) {
                Join<CustomerLead, LeadType> leadTypeJoin = root.join("leadType");
                predicates.add(cb.equal(leadTypeJoin.get("id"), criteria.getLeadTypeId()));
            }

            if (criteria.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), criteria.getStatus()));
            }

            if (criteria.getPriority() != null) {
                predicates.add(cb.equal(root.get("priority"), criteria.getPriority()));
            }

            if (criteria.getCreatedDateFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdDate"), criteria.getCreatedDateFrom().atStartOfDay()));
            }

            if (criteria.getCreatedDateTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdDate"), criteria.getCreatedDateTo().atTime(23, 59, 59)));
            }

            if (criteria.getNextFollowupDateFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("nextFollowupDate"), criteria.getNextFollowupDateFrom()));
            }

            if (criteria.getNextFollowupDateTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("nextFollowupDate"), criteria.getNextFollowupDateTo()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<CustomerLead> globalMatch(String query) {
        return (root, q, cb) -> {
            if (query == null || query.trim().isEmpty()) {
                return cb.conjunction();
            }
            String trimmed = query.trim().toLowerCase();
            String pattern = "%" + trimmed + "%";
            Join<CustomerLead, LeadType> leadTypeJoin = root.join("leadType", JoinType.LEFT);
            
            List<Predicate> predicates = new ArrayList<>();
            
            // 1. Customer Name
            predicates.add(cb.like(cb.lower(root.get("customerName")), pattern));
            // 2. Mobile
            predicates.add(cb.like(cb.lower(root.get("mobile")), pattern));
            // 3. Alternate Number
            predicates.add(cb.like(cb.lower(root.get("alternateNumber")), pattern));
            // 4. Email
            predicates.add(cb.like(cb.lower(root.get("email")), pattern));
            // 5. City
            predicates.add(cb.like(cb.lower(root.get("city")), pattern));
            // 6. Address
            predicates.add(cb.like(cb.lower(root.get("address")), pattern));
            // 7. Requirement
            predicates.add(cb.like(cb.lower(root.get("requirement")), pattern));
            // 8. Lead Source
            predicates.add(cb.like(cb.lower(root.get("leadSource")), pattern));
            // 9. Assigned Executive
            predicates.add(cb.like(cb.lower(root.get("assignedExecutive")), pattern));
            // 10. Discussion Details
            predicates.add(cb.like(cb.lower(root.get("discussionDetails")), pattern));
            
            // 11. Lead Type Name (with LEFT JOIN)
            predicates.add(cb.like(cb.lower(leadTypeJoin.get("leadTypeName")), pattern));
            
            // 12. Status partial enum name matches
            for (com.crm.entity.enums.LeadStatus status : com.crm.entity.enums.LeadStatus.values()) {
                if (status.name().toLowerCase().contains(trimmed)) {
                    predicates.add(cb.equal(root.get("status"), status));
                }
            }
            
            // 13. Priority partial enum name matches
            for (com.crm.entity.enums.Priority priority : com.crm.entity.enums.Priority.values()) {
                if (priority.name().toLowerCase().contains(trimmed)) {
                    predicates.add(cb.equal(root.get("priority"), priority));
                }
            }
            
            return cb.or(predicates.toArray(new Predicate[0]));
        };
    }
}
