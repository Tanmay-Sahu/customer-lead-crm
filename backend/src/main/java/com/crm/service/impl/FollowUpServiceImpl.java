package com.crm.service.impl;

import com.crm.dto.FollowUpRequestDTO;
import com.crm.dto.FollowUpResponseDTO;
import com.crm.entity.CustomerLead;
import com.crm.entity.FollowUp;
import com.crm.exception.ResourceNotFoundException;
import com.crm.mapper.FollowUpMapper;
import com.crm.repository.CustomerLeadRepository;
import com.crm.repository.FollowUpRepository;
import com.crm.service.FollowUpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FollowUpServiceImpl implements FollowUpService {

    private final FollowUpRepository followUpRepository;
    private final CustomerLeadRepository customerLeadRepository;
    private final FollowUpMapper followUpMapper;

    private void updateLeadNextFollowUpDate(CustomerLead lead) {
        if (lead == null) return;
        log.info("Updating next follow-up date for Lead ID: {}", lead.getId());
        List<FollowUp> followUps = followUpRepository.findByLeadIdOrderByFollowUpDateDesc(lead.getId());
        LocalDate nextDate = followUps.stream()
                .filter(f -> "PENDING".equalsIgnoreCase(f.getStatus()))
                .map(FollowUp::getFollowUpDate)
                .min(LocalDate::compareTo)
                .orElse(null);
        lead.setNextFollowupDate(nextDate);
        customerLeadRepository.save(lead);
    }

    @Override
    @Transactional
    public FollowUpResponseDTO createFollowUp(FollowUpRequestDTO requestDTO) {
        log.info("Creating Follow-up for Lead ID: {}", requestDTO.getLeadId());
        
        CustomerLead lead = customerLeadRepository.findById(requestDTO.getLeadId())
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with ID: " + requestDTO.getLeadId()));

        FollowUp followUp = followUpMapper.toEntity(requestDTO);
        followUp.setLead(lead);
        
        FollowUp savedFollowUp = followUpRepository.save(followUp);
        
        updateLeadNextFollowUpDate(lead);
        
        return followUpMapper.toResponseDTO(savedFollowUp);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FollowUpResponseDTO> getAllFollowUps() {
        return followUpMapper.toResponseDTOList(followUpRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public FollowUpResponseDTO getFollowUpById(Long id) {
        FollowUp followUp = followUpRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Follow-up not found with ID: " + id));
        return followUpMapper.toResponseDTO(followUp);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FollowUpResponseDTO> getFollowUpsByLeadId(Long leadId) {
        return followUpMapper.toResponseDTOList(followUpRepository.findByLeadIdOrderByFollowUpDateDesc(leadId));
    }

    @Override
    @Transactional
    public FollowUpResponseDTO updateFollowUp(Long id, FollowUpRequestDTO requestDTO) {
        FollowUp followUp = followUpRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Follow-up not found with ID: " + id));

        CustomerLead lead = customerLeadRepository.findById(requestDTO.getLeadId())
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with ID: " + requestDTO.getLeadId()));

        CustomerLead oldLead = followUp.getLead();

        followUpMapper.updateEntityFromDTO(requestDTO, followUp);
        followUp.setLead(lead);
        
        FollowUp savedFollowUp = followUpRepository.save(followUp);

        updateLeadNextFollowUpDate(lead);
        if (oldLead != null && !oldLead.getId().equals(lead.getId())) {
            updateLeadNextFollowUpDate(oldLead);
        }
        
        return followUpMapper.toResponseDTO(savedFollowUp);
    }

    @Override
    @Transactional
    public void deleteFollowUp(Long id) {
        FollowUp followUp = followUpRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Follow-up not found with ID: " + id));
        CustomerLead lead = followUp.getLead();
        followUpRepository.delete(followUp);
        if (lead != null) {
            updateLeadNextFollowUpDate(lead);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<FollowUpResponseDTO> getTodaysFollowUps() {
        return followUpMapper.toResponseDTOList(followUpRepository.findByFollowUpDateAndStatus(LocalDate.now(), "PENDING"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<FollowUpResponseDTO> getOverdueFollowUps() {
        return followUpMapper.toResponseDTOList(followUpRepository.findByFollowUpDateBeforeAndStatus(LocalDate.now(), "PENDING"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<FollowUpResponseDTO> getUpcomingFollowUps() {
        return followUpMapper.toResponseDTOList(followUpRepository.findByFollowUpDateAfterAndStatus(LocalDate.now(), "PENDING"));
    }
}
