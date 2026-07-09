package com.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadTypeResponseDTO {
    private Long id;
    private String leadTypeName;
    private String description;
    private LocalDateTime createdDate;
}
