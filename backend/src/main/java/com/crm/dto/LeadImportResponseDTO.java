package com.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadImportResponseDTO {
    private int totalRows;
    private int importedCount;
    private int failedCount;
    private List<RowError> errors;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RowError {
        private int rowNumber;
        private String errorMessage;
    }
}
