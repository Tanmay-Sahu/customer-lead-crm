package com.crm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoteRequestDTO {
    @NotNull(message = "Lead ID is required")
    private Long leadId;

    @NotBlank(message = "Note content cannot be empty")
    private String note;
}
