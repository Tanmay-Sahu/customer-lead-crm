package com.crm.entity;

import com.crm.entity.enums.LeadStatus;
import com.crm.entity.enums.Priority;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_lead")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerLead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @Column(nullable = false, length = 15)
    private String mobile;

    @Column(name = "alternate_number", length = 15)
    private String alternateNumber;

    @Column(length = 100)
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_type_id")
    private LeadType leadType;

    @Column(length = 50)
    private String city;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(columnDefinition = "TEXT")
    private String requirement;

    @Column(name = "lead_source", length = 50)
    private String leadSource;

    @Column(name = "assigned_executive", length = 100)
    private String assignedExecutive;

    @Column(name = "discussion_details", columnDefinition = "TEXT")
    private String discussionDetails;

    @Column(name = "visit_date")
    private LocalDate visitDate;

    @Column(name = "next_followup_date")
    private LocalDate nextFollowupDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeadStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    @CreationTimestamp
    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;
}
