package com.crm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadTypeRequestDTO {

    @NotBlank(message = "Lead Type Name is required")
    @Size(max = 100, message = "Lead Type Name cannot exceed 100 characters")
    private String leadTypeName;

    private String description;
}
