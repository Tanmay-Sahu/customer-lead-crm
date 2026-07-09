package com.crm.service.impl;

import com.crm.dto.LeadTypeRequestDTO;
import com.crm.dto.LeadTypeResponseDTO;
import com.crm.entity.LeadType;
import com.crm.exception.DuplicateResourceException;
import com.crm.exception.ResourceNotFoundException;
import com.crm.mapper.LeadTypeMapper;
import com.crm.repository.LeadTypeRepository;
import com.crm.service.LeadTypeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeadTypeServiceImpl implements LeadTypeService {

    private final LeadTypeRepository leadTypeRepository;
    private final LeadTypeMapper leadTypeMapper;

    @Override
    @Transactional
    public LeadTypeResponseDTO createLeadType(LeadTypeRequestDTO requestDTO) {
        log.info("Creating new Lead Type: {}", requestDTO.getLeadTypeName());
        
        if (leadTypeRepository.existsByLeadTypeName(requestDTO.getLeadTypeName())) {
            throw new DuplicateResourceException("Lead Type with name '" + requestDTO.getLeadTypeName() + "' already exists.");
        }

        LeadType leadType = leadTypeMapper.toEntity(requestDTO);
        LeadType savedLeadType = leadTypeRepository.save(leadType);
        
        return leadTypeMapper.toResponseDTO(savedLeadType);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeadTypeResponseDTO> getAllLeadTypes() {
        log.debug("Fetching all Lead Types");
        List<LeadType> leadTypes = leadTypeRepository.findAll();
        return leadTypeMapper.toResponseDTOList(leadTypes);
    }

    @Override
    @Transactional(readOnly = true)
    public LeadTypeResponseDTO getLeadTypeById(Long id) {
        log.debug("Fetching Lead Type with ID: {}", id);
        LeadType leadType = leadTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead Type not found with ID: " + id));
        return leadTypeMapper.toResponseDTO(leadType);
    }

    @Override
    @Transactional
    public LeadTypeResponseDTO updateLeadType(Long id, LeadTypeRequestDTO requestDTO) {
        log.info("Updating Lead Type with ID: {}", id);
        
        LeadType leadType = leadTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead Type not found with ID: " + id));

        // Check if new name conflict with other records
        leadTypeRepository.findByLeadTypeName(requestDTO.getLeadTypeName())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new DuplicateResourceException("Lead Type with name '" + requestDTO.getLeadTypeName() + "' already exists.");
                    }
                });

        leadTypeMapper.updateEntityFromDTO(requestDTO, leadType);
        LeadType updatedLeadType = leadTypeRepository.save(leadType);
        
        return leadTypeMapper.toResponseDTO(updatedLeadType);
    }

    @Override
    @Transactional
    public void deleteLeadType(Long id) {
        log.info("Deleting Lead Type with ID: {}", id);
        if (!leadTypeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Lead Type not found with ID: " + id);
        }
        leadTypeRepository.deleteById(id);
    }
}
