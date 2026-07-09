package com.crm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowUpRequestDTO {

    @NotNull(message = "Lead ID is required")
    private Long leadId;

    @NotBlank(message = "Discussion is required")
    private String discussion;

    @NotNull(message = "Follow-up date is required")
    private LocalDate followUpDate;

    @NotBlank(message = "Status is required")
    private String status;
}
