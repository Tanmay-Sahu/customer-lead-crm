package com.crm.controller;

import com.crm.dto.ApiResponse;
import com.crm.dto.FollowUpRequestDTO;
import com.crm.dto.FollowUpResponseDTO;
import com.crm.service.FollowUpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follow-ups")
@RequiredArgsConstructor
public class FollowUpController {

    private final FollowUpService followUpService;

    @PostMapping
    public ResponseEntity<ApiResponse<FollowUpResponseDTO>> createFollowUp(@Valid @RequestBody FollowUpRequestDTO requestDTO) {
        FollowUpResponseDTO response = followUpService.createFollowUp(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Follow-up recorded successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FollowUpResponseDTO>>> getAllFollowUps() {
        return ResponseEntity.ok(ApiResponse.success("Follow-ups fetched successfully", followUpService.getAllFollowUps()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FollowUpResponseDTO>> getFollowUpById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Follow-up fetched successfully", followUpService.getFollowUpById(id)));
    }

    @GetMapping("/lead/{leadId}")
    public ResponseEntity<ApiResponse<List<FollowUpResponseDTO>>> getFollowUpsByLeadId(@PathVariable Long leadId) {
        return ResponseEntity.ok(ApiResponse.success("Follow-up history fetched successfully", followUpService.getFollowUpsByLeadId(leadId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FollowUpResponseDTO>> updateFollowUp(
            @PathVariable Long id, 
            @Valid @RequestBody FollowUpRequestDTO requestDTO) {
        return ResponseEntity.ok(ApiResponse.success("Follow-up updated successfully", followUpService.updateFollowUp(id, requestDTO)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFollowUp(@PathVariable Long id) {
        followUpService.deleteFollowUp(id);
        return ResponseEntity.ok(ApiResponse.success("Follow-up deleted successfully", null));
    }

    @GetMapping("/today")
    public ResponseEntity<ApiResponse<List<FollowUpResponseDTO>>> getTodaysFollowUps() {
        return ResponseEntity.ok(ApiResponse.success("Today's follow-ups fetched successfully", followUpService.getTodaysFollowUps()));
    }

    @GetMapping("/overdue")
    public ResponseEntity<ApiResponse<List<FollowUpResponseDTO>>> getOverdueFollowUps() {
        return ResponseEntity.ok(ApiResponse.success("Overdue follow-ups fetched successfully", followUpService.getOverdueFollowUps()));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<FollowUpResponseDTO>>> getUpcomingFollowUps() {
        return ResponseEntity.ok(ApiResponse.success("Upcoming follow-ups fetched successfully", followUpService.getUpcomingFollowUps()));
    }
}
