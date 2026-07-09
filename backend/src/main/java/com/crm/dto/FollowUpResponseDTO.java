package com.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowUpResponseDTO {
    private Long id;
    private Long leadId;
    private String customerName;
    private String discussion;
    private LocalDate followUpDate;
    private String status;
    private LocalDateTime createdDate;
}
