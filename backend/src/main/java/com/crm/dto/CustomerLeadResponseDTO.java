package com.crm.dto;

import com.crm.entity.enums.LeadStatus;
import com.crm.entity.enums.Priority;
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
public class CustomerLeadResponseDTO {
    private Long id;
    private String customerName;
    private String mobile;
    private String alternateNumber;
    private String email;
    private Long leadTypeId;
    private String leadTypeName;
    private String city;
    private String address;
    private String requirement;
    private String leadSource;
    private String assignedExecutive;
    private String discussionDetails;
    private LocalDate visitDate;
    private LocalDate nextFollowupDate;
    private LeadStatus status;
    private Priority priority;
    private LocalDateTime createdDate;
}
