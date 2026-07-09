package com.crm.service;

import com.crm.dto.LeadTypeRequestDTO;
import com.crm.dto.LeadTypeResponseDTO;

import java.util.List;

public interface LeadTypeService {
    
    /**
     * Creates a new lead type.
     * @param requestDTO the lead type data
     * @return the created lead type
     */
    LeadTypeResponseDTO createLeadType(LeadTypeRequestDTO requestDTO);

    /**
     * Retrieves all lead types.
     * @return list of lead types
     */
    List<LeadTypeResponseDTO> getAllLeadTypes();

    /**
     * Retrieves a lead type by its ID.
     * @param id the record ID
     * @return the lead type
     */
    LeadTypeResponseDTO getLeadTypeById(Long id);

    /**
     * Updates an existing lead type.
     * @param id the record ID
     * @param requestDTO the updated data
     * @return the updated lead type
     */
    LeadTypeResponseDTO updateLeadType(Long id, LeadTypeRequestDTO requestDTO);

    /**
     * Deletes a lead type by its ID.
     * @param id the record ID
     */
    void deleteLeadType(Long id);
}
