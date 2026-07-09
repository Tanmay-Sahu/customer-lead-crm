package com.crm.dto;

import com.crm.entity.enums.LeadStatus;
import com.crm.entity.enums.Priority;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerLeadRequestDTO {

    @NotBlank(message = "Customer Name is required")
    @Size(max = 100, message = "Customer Name cannot exceed 100 characters")
    private String customerName;

    @NotBlank(message = "Mobile is required")
    @Pattern(regexp = "^\\d{10}$", message = "Mobile must contain exactly 10 digits")
    private String mobile;

    private String alternateNumber;

    @Email(message = "Invalid email format")
    private String email;

    @NotNull(message = "Lead Type ID is required")
    private Long leadTypeId;

    private String city;
    private String address;
    private String requirement;
    private String leadSource;
    private String assignedExecutive;
    private String discussionDetails;
    private LocalDate visitDate;
    private LocalDate nextFollowupDate;

    @NotNull(message = "Lead status is required")
    private LeadStatus status;

    @NotNull(message = "Lead priority is required")
    private Priority priority;
}
