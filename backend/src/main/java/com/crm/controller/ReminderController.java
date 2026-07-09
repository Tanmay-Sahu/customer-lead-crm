package com.crm.controller;

import com.crm.dto.ApiResponse;
import com.crm.dto.FollowUpResponseDTO;
import com.crm.service.FollowUpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final FollowUpService followUpService;

    @GetMapping("/today")
    public ResponseEntity<ApiResponse<List<FollowUpResponseDTO>>> getTodaysReminders() {
        return ResponseEntity.ok(ApiResponse.success("Today's reminders fetched successfully", followUpService.getTodaysFollowUps()));
    }

    @GetMapping("/overdue")
    public ResponseEntity<ApiResponse<List<FollowUpResponseDTO>>> getOverdueReminders() {
        return ResponseEntity.ok(ApiResponse.success("Overdue reminders fetched successfully", followUpService.getOverdueFollowUps()));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<FollowUpResponseDTO>>> getUpcomingReminders() {
        return ResponseEntity.ok(ApiResponse.success("Upcoming reminders fetched successfully", followUpService.getUpcomingFollowUps()));
    }
}
