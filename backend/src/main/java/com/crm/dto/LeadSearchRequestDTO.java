package com.crm.dto;

import com.crm.entity.enums.LeadStatus;
import com.crm.entity.enums.Priority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadSearchRequestDTO {
    private String customerName;
    private String mobile;
    private Long leadTypeId;
    private LeadStatus status;
    private Priority priority;
    private String city;
    
    // Date Ranges
    private LocalDate createdDateFrom;
    private LocalDate createdDateTo;
    
    private LocalDate nextFollowupDateFrom;
    private LocalDate nextFollowupDateTo;

    // Pagination & Sorting
    @Builder.Default
    private int page = 0;
    @Builder.Default
    private int size = 10;
    @Builder.Default
    private String sortBy = "createdDate";
    @Builder.Default
    private String sortDir = "desc";
}
