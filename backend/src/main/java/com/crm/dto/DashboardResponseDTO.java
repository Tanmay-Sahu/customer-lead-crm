package com.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponseDTO {
    // Lead Counts
    private long totalLeads;
    private long newLeads;
    private long contactedLeads;
    private long interestedLeads;
    private long followUpLeads;
    private long visitScheduledLeads;
    private long negotiationLeads;
    private long closedWonLeads;
    private long closedLostLeads;
    private long notInterestedLeads;

    // Priority Counts
    private long hotLeads;
    private long warmLeads;
    private long coldLeads;
    private long notCustomerLeads;

    // Reminders
    private long todaysFollowUps;
    private long overdueFollowUps;
    private long upcomingFollowUps;

    // Meta Counts
    private long totalNotes;
    private long totalLeadTypes;
    private long totalUsers;

    // Statistics for Charts
    private Map<String, Long> statusStats;
    private Map<String, Long> priorityStats;
    private Map<String, Long> leadTypeStats;
    private Map<String, Long> cityStats;
    private Map<String, Long> monthlyStats;
}
