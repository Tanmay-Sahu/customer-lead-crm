package com.crm.service.impl;

import com.crm.dto.CustomerLeadRequestDTO;
import com.crm.dto.CustomerLeadResponseDTO;
import com.crm.dto.LeadSearchRequestDTO;
import com.crm.entity.CustomerLead;
import com.crm.entity.LeadType;
import com.crm.exception.ResourceNotFoundException;
import com.crm.mapper.CustomerLeadMapper;
import com.crm.repository.CustomerLeadRepository;
import com.crm.repository.LeadTypeRepository;
import com.crm.repository.specification.CustomerLeadSpecification;
import com.crm.service.CustomerLeadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.crm.dto.LeadImportResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerLeadServiceImpl implements CustomerLeadService {

    private final CustomerLeadRepository customerLeadRepository;
    private final LeadTypeRepository leadTypeRepository;
    private final CustomerLeadMapper customerLeadMapper;

    @Override
    @Transactional
    public CustomerLeadResponseDTO createLead(CustomerLeadRequestDTO requestDTO) {
        log.info("Creating new Customer Lead for: {}", requestDTO.getCustomerName());
        
        LeadType leadType = leadTypeRepository.findById(requestDTO.getLeadTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Lead Type not found with ID: " + requestDTO.getLeadTypeId()));

        CustomerLead lead = customerLeadMapper.toEntity(requestDTO);
        lead.setLeadType(leadType);
        
        CustomerLead savedLead = customerLeadRepository.save(lead);
        return customerLeadMapper.toResponseDTO(savedLead);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerLeadResponseDTO> getAllLeads(int page, int size, String sortBy, String sortDir) {
        log.debug("Fetching all leads with pagination: page={}, size={}", page, size);
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return customerLeadRepository.findAll(pageable)
                .map(customerLeadMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerLeadResponseDTO getLeadById(Long id) {
        log.debug("Fetching Customer Lead with ID: {}", id);
        CustomerLead lead = customerLeadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer Lead not found with ID: " + id));
        return customerLeadMapper.toResponseDTO(lead);
    }

    @Override
    @Transactional
    public CustomerLeadResponseDTO updateLead(Long id, CustomerLeadRequestDTO requestDTO) {
        log.info("Updating Customer Lead with ID: {}", id);
        
        CustomerLead lead = customerLeadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer Lead not found with ID: " + id));

        LeadType leadType = leadTypeRepository.findById(requestDTO.getLeadTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Lead Type not found with ID: " + requestDTO.getLeadTypeId()));

        customerLeadMapper.updateEntityFromDTO(requestDTO, lead);
        lead.setLeadType(leadType);
        
        CustomerLead updatedLead = customerLeadRepository.save(lead);
        return customerLeadMapper.toResponseDTO(updatedLead);
    }

    @Override
    @Transactional
    public void deleteLead(Long id) {
        log.info("Deleting Customer Lead with ID: {}", id);
        if (!customerLeadRepository.existsById(id)) {
            throw new ResourceNotFoundException("Customer Lead not found with ID: " + id);
        }
        customerLeadRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerLeadResponseDTO> searchLeads(LeadSearchRequestDTO criteria) {
        log.debug("Searching leads with criteria: {}", criteria);
        
        Sort sort = criteria.getSortDir().equalsIgnoreCase("asc") 
                    ? Sort.by(criteria.getSortBy()).ascending() 
                    : Sort.by(criteria.getSortBy()).descending();
        
        Pageable pageable = PageRequest.of(criteria.getPage(), criteria.getSize(), sort);
        Specification<CustomerLead> spec = CustomerLeadSpecification.filterBy(criteria);
        
        return customerLeadRepository.findAll(spec, pageable)
                .map(customerLeadMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerLeadResponseDTO> globalSearch(String query, int page, int size, String sortBy, String sortDir) {
        log.debug("Global searching leads with query: {}", query);
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Specification<CustomerLead> spec = CustomerLeadSpecification.globalMatch(query);
        return customerLeadRepository.findAll(spec, pageable)
                .map(customerLeadMapper::toResponseDTO);
    }

    @Override
    @Transactional
    public LeadImportResponseDTO importLeads(MultipartFile file) {
        log.info("Importing leads from file: {}", file.getOriginalFilename());
        
        List<LeadImportResponseDTO.RowError> errors = new java.util.ArrayList<>();
        int importedCount = 0;
        int failedCount = 0;
        
        String filename = file.getOriginalFilename();
        if (filename == null || (!filename.endsWith(".xlsx") && !filename.endsWith(".xls"))) {
            throw new IllegalArgumentException("Invalid file format. Only .xlsx and .xls are supported.");
        }
        
        try (InputStream is = file.getInputStream();
             Workbook workbook = filename.endsWith(".xlsx") ? new XSSFWorkbook(is) : new HSSFWorkbook(is)) {
            
            if (workbook.getNumberOfSheets() == 0) {
                throw new IllegalArgumentException("Excel file is empty (contains no sheets)");
            }
            
            Sheet sheet = workbook.getSheetAt(0);
            int totalRows = sheet.getLastRowNum();
            if (totalRows == 0) {
                return LeadImportResponseDTO.builder()
                        .totalRows(0)
                        .importedCount(0)
                        .failedCount(0)
                        .errors(errors)
                        .build();
            }
            
            Row headerRow = sheet.getRow(0);
            if (headerRow == null) {
                throw new IllegalArgumentException("Header row not found in Excel file.");
            }
            
            Map<String, Integer> headerMap = new HashMap<>();
            for (Cell cell : headerRow) {
                String headerVal = getCellValueAsString(cell).trim().toLowerCase();
                if (!headerVal.isEmpty()) {
                    headerMap.put(headerVal, cell.getColumnIndex());
                }
            }
            
            Integer customerNameCol = getColIndex(headerMap, "customername", "name", "customer");
            Integer mobileCol = getColIndex(headerMap, "mobile", "phone", "contact", "mobileno");
            Integer altMobileCol = getColIndex(headerMap, "alternatenumber", "alternate", "altmobile");
            Integer emailCol = getColIndex(headerMap, "email", "emailaddress");
            Integer leadTypeCol = getColIndex(headerMap, "leadtype", "type");
            Integer cityCol = getColIndex(headerMap, "city");
            Integer addressCol = getColIndex(headerMap, "address");
            Integer requirementCol = getColIndex(headerMap, "requirement", "requirements");
            Integer leadSourceCol = getColIndex(headerMap, "leadsource", "source");
            Integer assignedExecCol = getColIndex(headerMap, "assignedexecutive", "executive", "assignedto");
            Integer discussionCol = getColIndex(headerMap, "discussiondetails", "discussion", "details");
            Integer visitDateCol = getColIndex(headerMap, "visitdate");
            Integer followupCol = getColIndex(headerMap, "nextfollowupdate", "followupdate", "nextfollowup");
            Integer statusCol = getColIndex(headerMap, "status");
            Integer priorityCol = getColIndex(headerMap, "priority");
            
            if (customerNameCol == null) {
                throw new IllegalArgumentException("Required column 'Customer Name' is missing in the header.");
            }
            if (mobileCol == null) {
                throw new IllegalArgumentException("Required column 'Mobile' is missing in the header.");
            }
            
            List<LeadType> leadTypes = leadTypeRepository.findAll();
            Map<String, LeadType> leadTypeMap = leadTypes.stream()
                .collect(Collectors.toMap(lt -> lt.getLeadTypeName().toLowerCase().trim(), lt -> lt, (a, b) -> a));
            
            Set<String> processedMobiles = new HashSet<>();
            int actualLeadRows = 0;
            
            for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row == null) {
                    continue;
                }
                
                if (isRowEmpty(row)) {
                    continue;
                }
                
                actualLeadRows++;
                int displayRowNumber = rowIndex + 1;
                
                String customerName = getCellValueAsString(row.getCell(customerNameCol)).trim();
                String mobile = getCellValueAsString(row.getCell(mobileCol)).trim();
                
                if (customerName.isEmpty()) {
                    failedCount++;
                    errors.add(new LeadImportResponseDTO.RowError(displayRowNumber, "Customer Name is required."));
                    continue;
                }
                
                if (mobile.isEmpty()) {
                    failedCount++;
                    errors.add(new LeadImportResponseDTO.RowError(displayRowNumber, "Mobile is required."));
                    continue;
                }
                
                String normalizedMobile = mobile.replaceAll("[^0-9]", "");
                if (normalizedMobile.startsWith("91") && normalizedMobile.length() == 12) {
                    normalizedMobile = normalizedMobile.substring(2);
                }
                
                if (!normalizedMobile.matches("^\\d{10}$")) {
                    failedCount++;
                    errors.add(new LeadImportResponseDTO.RowError(displayRowNumber, "Mobile must contain exactly 10 digits (got: " + mobile + ")."));
                    continue;
                }
                
                if (processedMobiles.contains(normalizedMobile)) {
                    failedCount++;
                    errors.add(new LeadImportResponseDTO.RowError(displayRowNumber, "Duplicate mobile number found in spreadsheet: " + mobile));
                    continue;
                }
                
                if (customerLeadRepository.existsByMobile(normalizedMobile)) {
                    failedCount++;
                    errors.add(new LeadImportResponseDTO.RowError(displayRowNumber, "Mobile number already exists in database: " + mobile));
                    continue;
                }
                
                String email = "";
                if (emailCol != null) {
                    email = getCellValueAsString(row.getCell(emailCol)).trim();
                    if (!email.isEmpty() && !email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                        failedCount++;
                        errors.add(new LeadImportResponseDTO.RowError(displayRowNumber, "Invalid email format: " + email));
                        continue;
                    }
                }
                
                LocalDate visitDate = null;
                if (visitDateCol != null) {
                    try {
                        visitDate = parseDate(row.getCell(visitDateCol));
                    } catch (Exception e) {
                        failedCount++;
                        errors.add(new LeadImportResponseDTO.RowError(displayRowNumber, "Invalid Visit Date cell: " + e.getMessage()));
                        continue;
                    }
                }
                
                LocalDate followupDate = null;
                if (followupCol != null) {
                    try {
                        followupDate = parseDate(row.getCell(followupCol));
                    } catch (Exception e) {
                        failedCount++;
                        errors.add(new LeadImportResponseDTO.RowError(displayRowNumber, "Invalid Next Follow-up Date cell: " + e.getMessage()));
                        continue;
                    }
                }
                
                com.crm.entity.enums.LeadStatus status = com.crm.entity.enums.LeadStatus.NEW;
                if (statusCol != null) {
                    String statusStr = getCellValueAsString(row.getCell(statusCol)).trim().toUpperCase().replace(" ", "_");
                    if (!statusStr.isEmpty()) {
                        try {
                            status = com.crm.entity.enums.LeadStatus.valueOf(statusStr);
                        } catch (IllegalArgumentException e) {
                            status = com.crm.entity.enums.LeadStatus.NEW;
                        }
                    }
                }
                
                com.crm.entity.enums.Priority priority = com.crm.entity.enums.Priority.COLD;
                if (priorityCol != null) {
                    String priorityStr = getCellValueAsString(row.getCell(priorityCol)).trim().toUpperCase().replace(" ", "_");
                    if (!priorityStr.isEmpty()) {
                        try {
                            priority = com.crm.entity.enums.Priority.valueOf(priorityStr);
                        } catch (IllegalArgumentException e) {
                            priority = com.crm.entity.enums.Priority.COLD;
                        }
                    }
                }
                
                LeadType leadType = null;
                if (leadTypeCol != null) {
                    String leadTypeName = getCellValueAsString(row.getCell(leadTypeCol)).trim();
                    if (!leadTypeName.isEmpty()) {
                        leadType = leadTypeMap.get(leadTypeName.toLowerCase());
                    }
                }
                
                CustomerLead lead = CustomerLead.builder()
                        .customerName(customerName)
                        .mobile(normalizedMobile)
                        .alternateNumber(altMobileCol != null ? getCellValueAsString(row.getCell(altMobileCol)).trim() : null)
                        .email(email.isEmpty() ? null : email)
                        .leadType(leadType)
                        .city(cityCol != null ? getCellValueAsString(row.getCell(cityCol)).trim() : null)
                        .address(addressCol != null ? getCellValueAsString(row.getCell(addressCol)).trim() : null)
                        .requirement(requirementCol != null ? getCellValueAsString(row.getCell(requirementCol)).trim() : null)
                        .leadSource(leadSourceCol != null ? getCellValueAsString(row.getCell(leadSourceCol)).trim() : null)
                        .assignedExecutive(assignedExecCol != null ? getCellValueAsString(row.getCell(assignedExecCol)).trim() : null)
                        .discussionDetails(discussionCol != null ? getCellValueAsString(row.getCell(discussionCol)).trim() : null)
                        .visitDate(visitDate)
                        .nextFollowupDate(followupDate)
                        .status(status)
                        .priority(priority)
                        .build();
                
                customerLeadRepository.save(lead);
                processedMobiles.add(normalizedMobile);
                importedCount++;
            }
            
            return LeadImportResponseDTO.builder()
                    .totalRows(actualLeadRows)
                    .importedCount(importedCount)
                    .failedCount(failedCount)
                    .errors(errors)
                    .build();
            
        } catch (IOException e) {
            log.error("Error reading import Excel file", e);
            throw new RuntimeException("Failed to read Excel file: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] generateImportTemplate() throws IOException {
        log.info("Generating Excel Import template");
        
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            
            Sheet sheet = workbook.createSheet("Leads Template");
            
            Row headerRow = sheet.createRow(0);
            String[] headers = {
                "Customer Name", "Mobile", "Alternate Number", "Email", "Lead Type",
                "City", "Address", "Requirement", "Lead Source", "Assigned Executive",
                "Discussion Details", "Visit Date", "Next Follow-up Date", "Status", "Priority"
            };
            
            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            Row sampleRow = sheet.createRow(1);
            sampleRow.createCell(0).setCellValue("John Doe");
            sampleRow.createCell(1).setCellValue("9876543210");
            sampleRow.createCell(2).setCellValue("9876543211");
            sampleRow.createCell(3).setCellValue("john.doe@example.com");
            sampleRow.createCell(4).setCellValue("Property");
            sampleRow.createCell(5).setCellValue("Mumbai");
            sampleRow.createCell(6).setCellValue("123, Nariman Point, Mumbai");
            sampleRow.createCell(7).setCellValue("Looking to buy a 2BHK residential flat");
            sampleRow.createCell(8).setCellValue("Google Ads");
            sampleRow.createCell(9).setCellValue("Sales Executive A");
            sampleRow.createCell(10).setCellValue("Called and discussed budget. Scheduled site visit.");
            sampleRow.createCell(11).setCellValue("2026-07-15");
            sampleRow.createCell(12).setCellValue("2026-07-20");
            sampleRow.createCell(13).setCellValue("NEW");
            sampleRow.createCell(14).setCellValue("HOT");
            
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            workbook.write(bos);
            return bos.toByteArray();
        }
    }

    private boolean isRowEmpty(Row row) {
        for (int c = 0; c < row.getLastCellNum(); c++) {
            Cell cell = row.getCell(c);
            if (cell != null && cell.getCellType() != CellType.BLANK) {
                if (!getCellValueAsString(cell).trim().isEmpty()) {
                    return false;
                }
            }
        }
        return true;
    }

    private Integer getColIndex(Map<String, Integer> headerMap, String... keys) {
        for (String key : keys) {
            String normalizedKey = key.toLowerCase().replace(" ", "").replace("-", "").replace("_", "");
            for (Map.Entry<String, Integer> entry : headerMap.entrySet()) {
                String normalizedEntry = entry.getKey().toLowerCase().replace(" ", "").replace("-", "").replace("_", "");
                if (normalizedEntry.equals(normalizedKey)) {
                    return entry.getValue();
                }
            }
        }
        return null;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getLocalDateTimeCellValue().toLocalDate().toString();
                }
                double numericVal = cell.getNumericCellValue();
                long longVal = (long) numericVal;
                if (numericVal == longVal) {
                    return String.valueOf(longVal);
                }
                return String.format("%.0f", numericVal);
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                try {
                    return cell.getStringCellValue().trim();
                } catch (Exception e) {
                    try {
                        return String.valueOf((long) cell.getNumericCellValue());
                    } catch (Exception ex) {
                        return "";
                    }
                }
            case BLANK:
            default:
                return "";
        }
    }

    private LocalDate parseDate(Cell cell) {
        if (cell == null || cell.getCellType() == CellType.BLANK) {
            return null;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            if (DateUtil.isCellDateFormatted(cell)) {
                return cell.getLocalDateTimeCellValue().toLocalDate();
            } else {
                throw new IllegalArgumentException("Cell contains a numeric value that is not formatted as an Excel Date");
            }
        }
        if (cell.getCellType() == CellType.STRING) {
            String val = cell.getStringCellValue().trim();
            if (val.isEmpty()) {
                return null;
            }
            String[] formats = {
                "yyyy-MM-dd", "dd-MM-yyyy", "dd/MM/yyyy", "MM/dd/yyyy", "yyyy/MM/dd",
                "yyyy-M-d", "d-M-yyyy", "d/M/yyyy", "M/d/yyyy", "yyyy/M/d"
            };
            for (String format : formats) {
                try {
                    return LocalDate.parse(val, DateTimeFormatter.ofPattern(format));
                } catch (DateTimeParseException ignored) {}
            }
            throw new IllegalArgumentException("Expected matching date format (e.g. yyyy-MM-dd or dd/MM/yyyy), but got: " + val);
        }
        throw new IllegalArgumentException("Cell type (type=" + cell.getCellType() + ") is invalid for mapping dates");
    }
}
