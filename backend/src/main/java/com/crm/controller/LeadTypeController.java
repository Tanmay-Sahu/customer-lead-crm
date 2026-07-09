package com.crm.controller;

import com.crm.dto.ApiResponse;
import com.crm.dto.LeadTypeRequestDTO;
import com.crm.dto.LeadTypeResponseDTO;
import com.crm.service.LeadTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lead-types")
@RequiredArgsConstructor
public class LeadTypeController {

    private final LeadTypeService leadTypeService;

    @PostMapping
    public ResponseEntity<ApiResponse<LeadTypeResponseDTO>> createLeadType(@Valid @RequestBody LeadTypeRequestDTO requestDTO) {
        LeadTypeResponseDTO response = leadTypeService.createLeadType(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Lead Type created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LeadTypeResponseDTO>>> getAllLeadTypes() {
        List<LeadTypeResponseDTO> response = leadTypeService.getAllLeadTypes();
        return ResponseEntity.ok(ApiResponse.success("Lead Types fetched successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LeadTypeResponseDTO>> getLeadTypeById(@PathVariable Long id) {
        LeadTypeResponseDTO response = leadTypeService.getLeadTypeById(id);
        return ResponseEntity.ok(ApiResponse.success("Lead Type fetched successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LeadTypeResponseDTO>> updateLeadType(
            @PathVariable Long id, 
            @Valid @RequestBody LeadTypeRequestDTO requestDTO) {
        LeadTypeResponseDTO response = leadTypeService.updateLeadType(id, requestDTO);
        return ResponseEntity.ok(ApiResponse.success("Lead Type updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLeadType(@PathVariable Long id) {
        leadTypeService.deleteLeadType(id);
        return ResponseEntity.ok(ApiResponse.success("Lead Type deleted successfully", null));
    }
}
