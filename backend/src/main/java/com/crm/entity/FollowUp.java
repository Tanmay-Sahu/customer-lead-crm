package com.crm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "follow_up")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowUp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", nullable = false)
    private CustomerLead lead;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String discussion;

    @Column(name = "followup_date", nullable = false)
    private LocalDate followUpDate;

    @Column(nullable = false, length = 50)
    private String status;

    @CreationTimestamp
    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;
}
