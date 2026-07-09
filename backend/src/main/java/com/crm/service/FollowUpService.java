package com.crm.service;

import com.crm.dto.FollowUpRequestDTO;
import com.crm.dto.FollowUpResponseDTO;

import java.util.List;

public interface FollowUpService {
    
    FollowUpResponseDTO createFollowUp(FollowUpRequestDTO requestDTO);

    List<FollowUpResponseDTO> getAllFollowUps();

    FollowUpResponseDTO getFollowUpById(Long id);

    List<FollowUpResponseDTO> getFollowUpsByLeadId(Long leadId);

    FollowUpResponseDTO updateFollowUp(Long id, FollowUpRequestDTO requestDTO);

    void deleteFollowUp(Long id);

    List<FollowUpResponseDTO> getTodaysFollowUps();

    List<FollowUpResponseDTO> getOverdueFollowUps();

    List<FollowUpResponseDTO> getUpcomingFollowUps();
}
