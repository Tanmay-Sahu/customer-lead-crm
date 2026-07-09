package com.crm.controller;

import com.crm.dto.ApiResponse;
import com.crm.dto.DashboardResponseDTO;
import com.crm.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponseDTO>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success("Dashboard statistics fetched successfully", dashboardService.getDashboardStats()));
    }
}
