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
public class NoteResponseDTO {
    private Long id;
    private Long leadId;
    private String note;
    private LocalDateTime createdDate;
}
