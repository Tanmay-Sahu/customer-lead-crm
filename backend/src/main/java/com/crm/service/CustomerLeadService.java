package com.crm.service;

import com.crm.dto.CustomerLeadRequestDTO;
import com.crm.dto.CustomerLeadResponseDTO;
import com.crm.dto.LeadSearchRequestDTO;
import com.crm.dto.LeadImportResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface CustomerLeadService {
    
    CustomerLeadResponseDTO createLead(CustomerLeadRequestDTO requestDTO);

    Page<CustomerLeadResponseDTO> getAllLeads(int page, int size, String sortBy, String sortDir);

    CustomerLeadResponseDTO getLeadById(Long id);

    CustomerLeadResponseDTO updateLead(Long id, CustomerLeadRequestDTO requestDTO);

    void deleteLead(Long id);

    Page<CustomerLeadResponseDTO> searchLeads(LeadSearchRequestDTO criteria);

    Page<CustomerLeadResponseDTO> globalSearch(String query, int page, int size, String sortBy, String sortDir);

    LeadImportResponseDTO importLeads(MultipartFile file);

    byte[] generateImportTemplate() throws IOException;
}
