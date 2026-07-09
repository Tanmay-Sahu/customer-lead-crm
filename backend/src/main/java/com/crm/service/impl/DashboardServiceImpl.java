package com.crm.service.impl;

import com.crm.dto.DashboardResponseDTO;
import com.crm.entity.CustomerLead;
import com.crm.entity.enums.LeadStatus;
import com.crm.entity.enums.Priority;
import com.crm.repository.*;
import com.crm.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final CustomerLeadRepository leadRepository;
    private final LeadTypeRepository leadTypeRepository;
    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final FollowUpRepository followUpRepository;

    @Override
    public DashboardResponseDTO getDashboardStats() {
        log.info("Generating Dashboard statistics");
        
        List<CustomerLead> allLeads = leadRepository.findAll();
        LocalDate today = LocalDate.now();

        // Basic Counts
        long totalLeads = allLeads.size();
        
        Map<LeadStatus, Long> statusCounts = allLeads.stream()
                .collect(Collectors.groupingBy(CustomerLead::getStatus, Collectors.counting()));
        
        Map<Priority, Long> priorityCounts = allLeads.stream()
                .collect(Collectors.groupingBy(CustomerLead::getPriority, Collectors.counting()));

        // Chart Data (Status)
        Map<String, Long> statusStats = new LinkedHashMap<>();
        for (LeadStatus status : LeadStatus.values()) {
            statusStats.put(status.name(), statusCounts.getOrDefault(status, 0L));
        }

        // Chart Data (Priority)
        Map<String, Long> priorityStats = new LinkedHashMap<>();
        for (Priority p : Priority.values()) {
            priorityStats.put(p.name(), priorityCounts.getOrDefault(p, 0L));
        }

        // Chart Data (Lead Type)
        Map<String, Long> leadTypeStats = allLeads.stream()
                .filter(l -> l.getLeadType() != null)
                .collect(Collectors.groupingBy(l -> l.getLeadType().getLeadTypeName(), Collectors.counting()));

        // Chart Data (City)
        Map<String, Long> cityStats = allLeads.stream()
                .filter(l -> l.getCity() != null && !l.getCity().isEmpty())
                .collect(Collectors.groupingBy(CustomerLead::getCity, Collectors.counting()));

        // Monthly Stats (Last 6 months)
        Map<String, Long> monthlyStats = new LinkedHashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");
        for (int i = 5; i >= 0; i--) {
            LocalDate monthDate = today.minusMonths(i);
            String label = monthDate.format(formatter);
            long count = allLeads.stream()
                    .filter(l -> l.getCreatedDate() != null && 
                               l.getCreatedDate().getMonth() == monthDate.getMonth() && 
                               l.getCreatedDate().getYear() == monthDate.getYear())
                    .count();
            monthlyStats.put(label, count);
        }

        return DashboardResponseDTO.builder()
                .totalLeads(totalLeads)
                .newLeads(statusCounts.getOrDefault(LeadStatus.NEW, 0L))
                .contactedLeads(statusCounts.getOrDefault(LeadStatus.CONTACTED, 0L))
                .interestedLeads(statusCounts.getOrDefault(LeadStatus.INTERESTED, 0L))
                .followUpLeads(statusCounts.getOrDefault(LeadStatus.FOLLOW_UP, 0L))
                .visitScheduledLeads(statusCounts.getOrDefault(LeadStatus.VISIT_SCHEDULED, 0L))
                .negotiationLeads(statusCounts.getOrDefault(LeadStatus.NEGOTIATION, 0L))
                .closedWonLeads(statusCounts.getOrDefault(LeadStatus.CLOSED_WON, 0L))
                .closedLostLeads(statusCounts.getOrDefault(LeadStatus.CLOSED_LOST, 0L))
                .notInterestedLeads(statusCounts.getOrDefault(LeadStatus.NOT_INTERESTED, 0L))
                
                .hotLeads(priorityCounts.getOrDefault(Priority.HOT, 0L))
                .warmLeads(priorityCounts.getOrDefault(Priority.WARM, 0L))
                .coldLeads(priorityCounts.getOrDefault(Priority.COLD, 0L))
                .notCustomerLeads(priorityCounts.getOrDefault(Priority.NOT_CUSTOMER, 0L))
                
                .todaysFollowUps(followUpRepository.findByFollowUpDateAndStatus(today, "PENDING").size())
                .overdueFollowUps(followUpRepository.findByFollowUpDateBeforeAndStatus(today, "PENDING").size())
                .upcomingFollowUps(followUpRepository.findByFollowUpDateAfterAndStatus(today, "PENDING").size())
                
                .totalNotes(noteRepository.count())
                .totalLeadTypes(leadTypeRepository.count())
                .totalUsers(userRepository.count())
                
                .statusStats(statusStats)
                .priorityStats(priorityStats)
                .leadTypeStats(leadTypeStats)
                .cityStats(cityStats)
                .monthlyStats(monthlyStats)
                .build();
    }
}
