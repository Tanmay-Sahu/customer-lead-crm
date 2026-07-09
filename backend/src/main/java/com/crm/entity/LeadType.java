package com.crm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing the type of a customer lead (e.g., Property, Insurance).
 */
@Entity
@Table(name = "lead_type")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lead_type_name", nullable = false, unique = true, length = 100)
    private String leadTypeName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;
}
