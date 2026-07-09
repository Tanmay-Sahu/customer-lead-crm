package com.crm.controller;

import com.crm.dto.ApiResponse;
import com.crm.dto.CustomerLeadRequestDTO;
import com.crm.dto.CustomerLeadResponseDTO;
import com.crm.dto.LeadSearchRequestDTO;
import com.crm.entity.enums.LeadStatus;
import com.crm.entity.enums.Priority;
import com.crm.service.CustomerLeadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class CustomerLeadController {

    private final CustomerLeadService customerLeadService;

    @PostMapping
    public ResponseEntity<ApiResponse<CustomerLeadResponseDTO>> createLead(@Valid @RequestBody CustomerLeadRequestDTO requestDTO) {
        CustomerLeadResponseDTO response = customerLeadService.createLead(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Lead created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CustomerLeadResponseDTO>>> getAllLeads(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Page<CustomerLeadResponseDTO> response = customerLeadService.getAllLeads(page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success("Leads fetched successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerLeadResponseDTO>> getLeadById(@PathVariable Long id) {
        CustomerLeadResponseDTO response = customerLeadService.getLeadById(id);
        return ResponseEntity.ok(ApiResponse.success("Lead fetched successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerLeadResponseDTO>> updateLead(
            @PathVariable Long id, 
            @Valid @RequestBody CustomerLeadRequestDTO requestDTO) {
        CustomerLeadResponseDTO response = customerLeadService.updateLead(id, requestDTO);
        return ResponseEntity.ok(ApiResponse.success("Lead updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLead(@PathVariable Long id) {
        customerLeadService.deleteLead(id);
        return ResponseEntity.ok(ApiResponse.success("Lead deleted successfully", null));
    }

    /**
     * Advanced Search API using POST for complex filtering.
     */
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<Page<CustomerLeadResponseDTO>>> searchLeads(@RequestBody LeadSearchRequestDTO criteria) {
        Page<CustomerLeadResponseDTO> response = customerLeadService.searchLeads(criteria);
        return ResponseEntity.ok(ApiResponse.success("Search results fetched successfully", response));
    }

    /**
     * Simple GET search for global filtering.
     */
    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<Page<CustomerLeadResponseDTO>>> filterLeads(
            @RequestParam(required = false) String customerName,
            @RequestParam(required = false) String mobile,
            @RequestParam(required = false) Long leadTypeId,
            @RequestParam(required = false) LeadStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        LeadSearchRequestDTO criteria = LeadSearchRequestDTO.builder()
                .customerName(customerName)
                .mobile(mobile)
                .leadTypeId(leadTypeId)
                .status(status)
                .priority(priority)
                .city(city)
                .createdDateFrom(fromDate)
                .createdDateTo(toDate)
                .page(page)
                .size(size)
                .sortBy(sortBy)
                .sortDir(sortDir)
                .build();
        
        Page<CustomerLeadResponseDTO> response = customerLeadService.searchLeads(criteria);
        return ResponseEntity.ok(ApiResponse.success("Filtered leads fetched successfully", response));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<CustomerLeadResponseDTO>>> globalSearch(
            @RequestParam(required = false, defaultValue = "") String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Page<CustomerLeadResponseDTO> response = customerLeadService.globalSearch(q, page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success("Global search results fetched successfully", response));
    }

    @PostMapping("/import")
    public ResponseEntity<ApiResponse<com.crm.dto.LeadImportResponseDTO>> importLeads(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        com.crm.dto.LeadImportResponseDTO response = customerLeadService.importLeads(file);
        return ResponseEntity.ok(ApiResponse.success("Excel import processed successfully", response));
    }

    @GetMapping("/import/template")
    public ResponseEntity<byte[]> downloadTemplate() throws java.io.IOException {
        byte[] data = customerLeadService.generateImportTemplate();
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=lead_import_template.xlsx")
                .contentType(org.springframework.http.MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(data);
    }
}
